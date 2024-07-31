# import os
# from typing import List, Dict
# from unstructured.partition.auto import partition
# from unstructured.ingest.connector.salesforce import SalesforceAccessConfig, SimpleSalesforceConfig
# from unstructured.ingest.interfaces import PartitionConfig, ProcessorConfig, ReadConfig
# from unstructured.ingest.runner import SalesforceRunner
# import logging

# async def process_unstructured(upload_dir: str = "uploads") -> List[Dict[str, str]]:

#     output_list = []
#     if os.path.exists(upload_dir):
#         for filename in os.listdir(upload_dir):
#             file_path = os.path.join(upload_dir, filename)
#             if (os.path.isfile(file_path) and not file_path.endswith(('.mp3', '.wav', '.flac'))):
#                 # TODO plenty of room to investigate different extraction methods, times, and strategies
#                 try:
#                     elements = partition(filename=file_path, strategy='fast')
#                 except Exception as e:
#                     logging.error(f"Fast strategy failed for {file_path} with error: {e}")
#                     elements = partition(filename=file_path, strategy='auto')
#                 raw_content = "\n\n".join([str(el) for el in elements])
#                 output_list.append({'url': file_path, 'raw_content': raw_content})
#     else:
#         print(f"No uploads found. This function was called incorrectly.")

#     return output_list

# #TODO check logic for: if salesforce is connected, cast username, private key, and consumer key to envs below
# #TODO test function and add return typing
# async def process_salesforce(username: str, consumer_key: str, private_key: str) -> str:
#     """
#     To connect to Salesforce, make sure to specify:
#     - username: Salesforce username, usually looks like an email.
#     - consumer-key: For the Salesforce JWT auth. Found in Consumer Details.
#     - private-key: Path to the private key or its contents for the Salesforce JWT auth. 
#     Key file is usually named server.key.
#     """
#     runner = SalesforceRunner(
#         processor_config=ProcessorConfig(
#             verbose=True,
#             output_dir="salesforce-output",
#             num_processes=2,
#         ),
#         read_config=ReadConfig(),
#         partition_config=PartitionConfig(),
#         connector_config=SimpleSalesforceConfig(
#             access_config=SalesforceAccessConfig(
#                 consumer_key=os.getenv("SALESFORCE_CONSUMER_KEY"),
#             ),
#             username=os.getenv("SALESFORCE_USERNAME"),
#             private_key_path=os.getenv("SALESFORCE_PRIVATE_KEY_PATH"),
#             categories=["EmailMessage", "Account", "Lead", "Case", "Campaign"],
#             recursive=True,
#         ),
#     )
#     runner.run()
