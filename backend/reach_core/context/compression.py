from .retriever import SearchAPIRetriever
from langchain.retrievers import (
    ContextualCompressionRetriever,
)
from langchain.retrievers.document_compressors import (
    DocumentCompressorPipeline,
    EmbeddingsFilter,
)
from langchain.text_splitter import RecursiveCharacterTextSplitter


class ContextCompressor:
    def __init__(self, documents, embeddings, max_results=5, **kwargs):
        self.max_results = max_results
        self.documents = documents
        self.kwargs = kwargs
        self.embeddings = embeddings
        self.similarity_threshold = 0.30

    def _get_contextual_retriever(self):
        splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=100)
        relevance_filter = EmbeddingsFilter(embeddings=self.embeddings,
                                             similarity_threshold=self.similarity_threshold)
        pipeline_compressor = DocumentCompressorPipeline(
            transformers=[splitter, relevance_filter]
        )
        base_retriever = SearchAPIRetriever(
            pages=self.documents
        )
        contextual_retriever = ContextualCompressionRetriever(
            base_compressor=pipeline_compressor, base_retriever=base_retriever
        )
        return contextual_retriever

    def _pretty_print_docs(self, docs, top_n):
        formatted_string = []
        docs_list = []
        
        for i, d in enumerate(docs):
            if i < top_n:
                source = d.metadata.get('source')
                title = d.metadata.get('title')
                content = d.page_content

                formatted_string.append(f"Source: {source}\n"
                                        f"Title: {title}\n"
                                        f"Content: {content}\n")
                
                docs_list.append({
                    'Source': source,
                    'Title': title,
                    'Content': content
                })

        formatted_string = "\n".join(formatted_string)
        
        return formatted_string, docs_list

    def get_context(self, query, max_results=5):
        compressed_docs = self._get_contextual_retriever()
        relevant_docs = compressed_docs.get_relevant_documents(query)
        return self._pretty_print_docs(relevant_docs, max_results)