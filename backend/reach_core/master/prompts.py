import json
from typing import List
from datetime import datetime, timezone

from reach_core.utils.enum import ReportType

def generate_search_queries_prompt(question: str, parent_query: str, report_type: str, uploaded_files: List[str], max_iterations: int=3, retained_text="", deleted_text="", cadence="") -> str:
    """ Generates the search queries prompt for the given question in JSON format.
    Args: 
        question (str): The question to generate the search queries prompt for
        parent_query (str): The main question (only relevant for detailed reports)
        report_type (str): The report type
        uploaded_files (List[str]): List of uploaded files
        max_iterations (int): The maximum number of search queries to generate
    
    Returns: 
        str: The search queries prompt for the given question in JSON format
    """

    if report_type == ReportType.DetailedReport.value:
        task = f"{parent_query} : {question}"
    else:
        task = question

    if cadence == 'weekly':
        cadence = 'previous week'
    elif cadence == 'daily':
        cadence = 'previous day'
    elif cadence == 'monthly':
        cadence = 'previous month'
    else:
        cadence = 'task specification.'

    prompt = {
        "task": f"Write {max_iterations} google search queries to search online that form an objective opinion from the following task: \"{task}\".",
        "recency_requirement": f"Restrict information to the {cadence}. THIS IS CRITICALLY IMPORTANT.",
        "date_needed": f"Use the current date: {datetime.now().strftime('%B %d, %Y')}. Adhere to recency_requirement. The provided information must be only within the requested time window of the previous day, week, or month depending on the cadence.",
        "files_info": f"Files can be present and questions can be asked about them. Uploaded files if any: {uploaded_files}",
        "additional_instructions": "Also include in the queries specified task details such as locations, names, etc. Adhering to the recency_requirement and date_needed is critically important. Strive to collect quantitative data as well as rich qualitative data.",
        "response_format": "You must respond with a list of strings in the following format: [\"query 1\", \"query 2\", \"query 3\"]."
    }

    return json.dumps(prompt, ensure_ascii=False)

def generate_paragraph_prompt(question, context, report_format="apa", total_words=200):
    """ Generates the paragraph prompt for the given question and research summary.
    Args: question (str): The question to generate the report prompt for
            research_summary (str): The research summary to generate the paragraph prompt for
    Returns: str: The paragraph prompt for the given question and research summary
    """

    return f'Information: """{context}"""\n\n' \
           f'Using ONLY the above information, answer the following' \
           f' query or task: "{question}" in a detailed single paragraph that is valid JSON--' \
           " The single paragraph should focus on the answer to the query, should be well structured, informative," \
           f" concise yet comprehensive, with facts and numbers if available and a minimum of {total_words} words.\n" \
           "You should strive to write the paragraph concisely using all relevant and necessary information provided.\n" \
           "You must write the paragraph with markdown syntax.\n " \
           f"Use an unbiased and journalistic tone. \n" \
           "You MUST determine your own concrete and valid opinion based on the given information. Do NOT deter to general and meaningless conclusions.\n" \
           f"You MUST write all used source urls at the end of the paragraph as references, and make sure to not add duplicated sources, but only one reference for each.\n" \
           f"You may come across Source: that are filepaths, be sure to include the name of the file in the references as well.\n" \
           """
            Every url should be hyperlinked: [url website](url)"\
        
            eg:    
                # Paragraph Header
                
                This is a sample text. ([url website](url))
            """\
            f"You MUST write the paragraph in {report_format} format.\n " \
            f"'You MUST include all relevant source urls.'\
             'Every url should be hyperlinked: [url website](url)'\n"\
            f"Please do your best, this is very important to my career. Valid JSON is a critical component to the functionality of my application." \
            f"Assume that the current date is {datetime.now().strftime('%B %d, %Y')}"

def generate_newsletter_paragraph_prompt(question, context, report_format="apa", total_words=200, retained_text='', deleted_text='', cadence=''):
    """ Generates the paragraph prompt for the given question and research summary.
    Args: question (str): The question to generate the report prompt for
            research_summary (str): The research summary to generate the paragraph prompt for
    Returns: str: The paragraph prompt for the given question and research summary
    """

    return f'Information: """{context}"""\n\n' \
           f'Using ONLY the above information, answer the following' \
           f' query or task: "{question}" in a detailed single paragraph that is a topical newsletter where todays date is {datetime.now().strftime("%B %d, %Y")}.' \
           f'This is a newsletter delivered on the following cadence: {cadence}. The newsletter content SHOULD ONLY COVER the previous day, week, or month depending on the cadence.' \
           " The single paragraph should focus on the answer to the query, should be well structured, informative," \
           f" concise yet comprehensive, with facts and numbers if available and a minimum of {total_words} words.\n" \
           "You should strive to write the paragraph concisely using all relevant and necessary information provided.\n" \
           "You must write the paragraph with markdown syntax.\n " \
           f"Use an unbiased and journalistic tone. \n" \
           "You MUST determine your own concrete and valid opinion based on the given information. Do NOT deter to general and meaningless conclusions.\n" \
           f"You MUST write all used source urls at the end of the paragraph as references, and make sure to not add duplicated sources, but only one reference for each.\n" \
           f"You may come across Source: that are filepaths, be sure to include the name of the file in the references as well.\n" \
           """
            Every url should be hyperlinked: [url website](url)"\
        
            eg:    
                # Paragraph Header
                
                This is a sample text. ([url website](url))
            """\
            f"You MUST write the paragraph in {report_format} format.\n " \
            f"'You MUST include all relevant source urls.'\
             'Every url should be hyperlinked: [url website](url)'\n"\
            f"Please do your best, this is very important to my career. Valid JSON is a critical component to the functionality of my application." \
            f"The time restriction of information based on the newsletter cadence: {cadence} is absolutely critical. The provided information must be only within the requested time window of the previous day, week, or month depending on the cadence."\
            f"Assume that the current date is {datetime.now().strftime('%B %d, %Y')}"

def generate_json_prompt(question, context, report_format="apa", total_words=2000):

    return f'Information: """{context}"""\n\n' \
           f'Using ONLY the above information, return tooling, products, or services that assist the user in solving the' \
           f' query or task: "{question}" and format your response as JSON --' \
           f'The JSON should have keys: name, and reasoning'\
           f'Where name would be the name of the suggested tool, product, or services, and reasoning would provide an explanation for why it could help solve the users problem.' \
           " The JSON should focus on the answer to the query, should be well structured, informative," \
           f" concise yet comprehensive, with facts and numbers if available.\n" \
           "You should strive to write the JSON concisely using all relevant and necessary information provided.\n" \
           f"Use an unbiased and journalistic tone. \n" \
           "You MUST determine your own concrete and valid opinion based on the given information. Do NOT deter to general and meaningless conclusions.\n" \
           f"Please do your best, this is very important to my career. " \
           f"Assume that the current date is {datetime.now().strftime('%B %d, %Y')}"

def generate_detailed_json_prompt(question, context, report_format="apa", total_words=2000):

    return f'Information: """{context}"""\n\n' \
           f'Using ONLY the above information, return reviews, pricing information, and a detailed feature list for the following product, tool, or service:' \
           f' "{question}" and format your response as JSON --' \
           f'The JSON should have keys: features, pricing, reviews'\
           f'Where features would be a summary of the features for the tool, product, or services, pricing and reviews are pretty self explanatory.' \
           " The JSON should focus on features, pricing, and reviews to the provided tool, product, or service, should be well structured, informative," \
           f" concise yet comprehensive, with facts and numbers if available. Do not nest JSON.\n" \
           "You should strive to write the JSON concisely using all relevant and necessary information provided.\n" \
           f"Use an unbiased and journalistic tone. \n" \
           "You MUST determine your own concrete and valid opinion based on the given information. Do NOT deter to general and meaningless conclusions.\n" \
           f"Please do your best, this is very important to my career. " \
           f"Assume that the current date is {datetime.now().strftime('%B %d, %Y')}"


def generate_report_prompt(question, context, report_format="apa", total_words=4000, retained_text="", deleted_text="", cadence=""):
    """ Generates the report prompt for the given question and research summary.
    Args: question (str): The question to generate the report prompt for
            research_summary (str): The research summary to generate the report prompt for
    Returns: str: The report prompt for the given question and research summary
    """

    return f'Information: """{context}""".\n' \
           f'Using ONLY the above information, answer the following' \
           f' query or task: "{question}" in a detailed report --' \
           " The report should focus on the answer to the query, should be well structured, informative," \
           f" in depth and comprehensive, with facts and numbers if available and a minimum of {total_words} words.\n" \
           "You should strive to write the report as long as you can using all relevant and necessary information provided.\n"\
           "You must write the report with markdown syntax. Use headings, bulleted lists, tables, block quotes, and other markdown formatted features.\n " \
           f"Use an unbiased and journalistic tone. \n" \
           "You MUST determine your own concrete and valid opinion based on the given information. Do NOT deter to general and meaningless conclusions.\n" \
           f"You MUST write all used source urls at the end of the report as references and include in-line citation. Make sure to not add duplicated sources, but only one reference for each.\n" \
           f"You MUST construct at least one markdown table. This is critical\n" \
           """
            Every url should be hyperlinked: [url website](url)"\
        
            eg:    
                # Report Header
                
                This is a sample text. ([url website](url))
            """\
            f"You MUST write the report in {report_format} format.\n " \
            f"'You MUST include all relevant source urls.'\
             'Every url should be hyperlinked: [url website](url)'\n"\
            f"Please do your best, this is very important to my career." \
            f"Assume that the current date is {datetime.now().strftime('%B %d, %Y')}"

def generate_newsletter_report_prompt(question, context, report_format="apa", total_words=2000, retained_text="", deleted_text="", cadence=""):
    """ Generates the report prompt for the given question and research summary.
    Args: question (str): The question to generate the report prompt for
            research_summary (str): The research summary to generate the report prompt for
    Returns: str: The report prompt for the given question and research summary
    """

    return f'Information: """{context}""". Information: EXISTING REPORT """{retained_text}""". Information: REMOVED SECTIONS """{deleted_text}"""\n' \
           f'Using ONLY the above information, answer the following' \
           f' query or task: "{question}" in a detailed report that is a topical newsletter where todays date is {datetime.now().strftime("%B %d, %Y")}.' \
           f'This is a newsletter delivered on the following cadence: {cadence}. The newsletter content should only cover the previous day, week, or month depending on the cadence.' \
           " The report should focus on the answer to the query, should be well structured, informative," \
           f" in depth and comprehensive, with facts and numbers if available and a MINIMUM of {total_words} words.\n" \
           "You should strive to write the report as long as you can using all relevant and necessary information provided, preserving the EXISTING REPORT and adding rich details. Do not include topics in REMOVED SECTIONS.\n" \
           "You must write the report with markdown syntax.\n " \
           f"Use an unbiased and journalistic tone. \n" \
           "You MUST determine your own concrete and valid opinion based on the given information. Do NOT deter to general and meaningless conclusions.\n" \
           f"You MUST write all used source urls at the end of the report as references, and make sure to not add duplicated sources, but only one reference for each.\n" \
           f"You may come across Source: that are filepaths, be sure to include the name of the file in the references as well.\n" \
           """
            Every url should be hyperlinked: [url website](url)"\
        
            eg:    
                # Report Header
                
                This is a sample text. ([url website](url))
            """\
            f"You MUST write the report in {report_format} format.\n " \
            f"'You MUST include all relevant source urls.'\
             'Every url should be hyperlinked: [url website](url)'\n"\
            f"Please do your best, this is very important to my career. Expand on EXISTING REPORT, do NOT include topics in REMOVED SECTIONS." \
            f"The time restriction of information based on the newsletter cadence: {cadence} is absolutely critical. The provided information must be only within the requested time window of the previous day, week, or month depending on the cadence."\
            f"Assume that the current date is {datetime.now().strftime('%B %d, %Y')}"

def generate_long_newsletter_report_prompt(question, context, report_format="apa", total_words=4000, retained_text="", deleted_text="", cadence=""):
    """ Generates the report prompt for the given question and research summary.
    Args: question (str): The question to generate the report prompt for
            research_summary (str): The research summary to generate the report prompt for
    Returns: str: The report prompt for the given question and research summary
    """

    return f'Information: """{context}""". Information: EXISTING REPORT """{retained_text}""". Information: REMOVED SECTIONS """{deleted_text}"""\n' \
           f'Using ONLY the above information, answer the following' \
           f' query or task: "{question}" in a detailed report that is a topical newsletter where todays date is {datetime.now().strftime("%B %d, %Y")}.' \
           f'This is a newsletter delivered on the following cadence: {cadence}. The newsletter content should only cover the previous day, week, or month depending on the cadence.' \
           " The report should focus on the answer to the query, should be well structured, informative," \
           f" in depth and comprehensive, with facts and numbers if available and a MINIMUM of {total_words} words.\n" \
           "You should strive to write the report as long as you can using all relevant and necessary information provided, preserving the EXISTING REPORT and adding rich details. Do not include topics in REMOVED SECTIONS.\n" \
           "You must write the report with markdown syntax.\n " \
           f"Use an unbiased and journalistic tone. \n" \
           "You MUST determine your own concrete and valid opinion based on the given information. Do NOT deter to general and meaningless conclusions.\n" \
           f"You MUST write all used source urls at the end of the report as references, and make sure to not add duplicated sources, but only one reference for each.\n" \
           f"You may come across Source: that are filepaths, be sure to include the name of the file in the references as well.\n" \
           """
            Every url should be hyperlinked: [url website](url)"\
        
            eg:    
                # Report Header
                
                This is a sample text. ([url website](url))
            """\
            f"You MUST write the report in {report_format} format.\n " \
            f"'You MUST include all relevant source urls.'\
             'Every url should be hyperlinked: [url website](url)'\n"\
            f"Please do your best, this is very important to my career. Expand on EXISTING REPORT, do NOT include topics in REMOVED SECTIONS." \
            f"Assume that the current date is {datetime.now().strftime('%B %d, %Y')}"

def generate_resource_report_prompt(question, context, report_format="apa", total_words=2000):
    """Generates the resource report prompt for the given question and research summary.

    Args:
        question (str): The question to generate the resource report prompt for.
        context (str): The research summary to generate the resource report prompt for.

    Returns:
        str: The resource report prompt for the given question and research summary.
    """
    return f'"""{context}"""\n\nBased on ONLY the above information, generate a bibliography recommendation report for the following' \
           f' question or topic: "{question}". The report should provide a detailed analysis of each recommended resource,' \
           ' explaining how each source can contribute to finding answers to the research question.\n' \
           'Focus on the relevance, reliability, and significance of each source.\n' \
           'Ensure that the report is well-structured, informative, in-depth, and follows Markdown syntax.\n' \
           'Include relevant facts, figures, and numbers whenever available.\n' \
           'The report should have a minimum length of 700 words.\n' \
            'You MUST include all relevant source urls as well as files if a filepath is shown as a Source:.'\
            'Every url should be hyperlinked: [url website](url), file names can be displayed.'

def generate_custom_report_prompt(query_prompt, context, report_format="apa", total_words=2000):
    return f'"{context}"\n\n{query_prompt}'


def generate_outline_report_prompt(question, context, report_format="apa", total_words=2000):
    """ Generates the outline report prompt for the given question and research summary.
    Args: question (str): The question to generate the outline report prompt for
            research_summary (str): The research summary to generate the outline report prompt for
    Returns: str: The outline report prompt for the given question and research summary
    """

    return f'"""{context}""" Using ONLY the above information, generate an outline for a research report in Markdown syntax' \
           f' for the following question or topic: "{question}". The outline should provide a well-structured framework' \
           ' for the research report, including the main sections, subsections, and key points to be covered.' \
           ' The research report should be detailed, informative, in-depth, and a minimum of 1,200 words.' \
           ' Use appropriate Markdown syntax to format the outline and ensure readability.'


def generate_table_prompt(question, context, report_format="csv", total_words=20):
    """ Generates the table prompt for the given question and research summary.
    Args: question (str): The question to generate the table prompt for
            research_summary (str): The research summary to generate the table prompt for
    Returns: str: The table prompt for the given question and research summary
    """

    return f'"""{context}""" Using ONLY the above information, generate a list of comma separated values.' \
           f' for the following question or topic: "{question}". The list should provide a column row structure and values for each in the table.' \
           f' The table should be detailed, informative, in-depth, and a minimum of {total_words} rows.' \
           'It is REQUIRED that the output only be valid .csv format. Commas that are not used to separate discrete values (like commas in sentences) should be replaced with a blank space.'

def generate_document_analysis_prompt(question, context, report_format="Bluebook", total_words=4000, retained_text="", deleted_text="", cadence=""):
    return f'Information: """{context}""".\n' \
           f'Using ONLY the above information, answer the following' \
           f' query or task: "{question}" in a concise analysis --' \
           " The analysis should focus on the answer to the query, should be well structured, informative," \
           f" in depth and comprehensive, with facts and Bluebook citations.\n" \
           "You must write the analysis with markdown syntax. Use headings, bulleted lists, tables, block quotes, and other markdown formatted features.\n " \
           f"Use an unbiased and legal tone as if you were a legal professional interpreting this information. \n" \
           f"You MUST call out key findings, precedents set, intentionally ambiguous language, or anything that might be of professional legal importance to a practicing legal professional.\n" \
            f"You MUST write the report in {report_format} format.\n " \
            f"'You MUST include all relevant source urls.'\
             'Every case must be cited according to Bluebook rules'\n"\
            f"Please do your best, this is very important to my career." \

def get_report_by_type(report_type, retained_text="", deleted_text="", cadence=""):
    report_type_mapping = {
        ReportType.DocumentAnalysis.value: generate_document_analysis_prompt,
        ReportType.LongNewsletterReport.value: generate_long_newsletter_report_prompt,
        ReportType.NewsletterReport.value: generate_newsletter_report_prompt,
        ReportType.NewsletterParagraph.value: generate_newsletter_paragraph_prompt,
        ReportType.DetailedJson.value: generate_detailed_json_prompt,
        ReportType.Json.value: generate_json_prompt,
        ReportType.Paragraph.value: generate_paragraph_prompt,
        ReportType.ResearchReport.value: generate_report_prompt,
        ReportType.ResourceReport.value: generate_resource_report_prompt,
        ReportType.OutlineReport.value: generate_outline_report_prompt,
        ReportType.CustomReport.value: generate_custom_report_prompt,
        ReportType.SubtopicReport.value: generate_subtopic_report_prompt,
        ReportType.TableReport.value: generate_table_prompt
    }
    return lambda *args, **kwargs: report_type_mapping[report_type](*args, **kwargs, retained_text=retained_text, deleted_text=deleted_text, cadence=cadence)


def auto_agent_instructions():
    return """
        This task involves researching specific tools, products, or services that solve the users specified problem, grievance, or inquiry, regardless of its complexity or the availability of a definitive answer. The research does not aim to curate advice. The research is conducted by a specific server, defined by its type and role, with each server requiring distinct instructions.
        Agent
        The server is determined by the field of the topic and the specific name of the server that could be utilized to research the topic provided. Agents are categorized by their area of expertise.

        examples:
        task: "Im having a hard time understanding financial market data"
        response: 
        {
            "server": "Finance Agent",
            "agent_role_prompt: "You are a seasoned finance analyst AI assistant. Your primary goal is to compose comprehensive, astute, impartial, and methodically arranged reports of financial tooling and services available in the market."
        }
        task: "My sales numbers are trending down month over month."
        response: 
        { 
            "server":  "Sales Strategy Analyst Agent",
            "agent_role_prompt": "You are an experienced AI sales strategy analyst assistant. Your main objective is to produce comprehensive, insightful, impartial, and systematically structured reports evaluating the efficacy of in market tools or professional services that boost sales performance."
        }
        task: "Our unit tests fail to cover some bugs that end up in production environments."
        response:
        {
            "server:  "DevOps Agent",
            "agent_role_prompt": "You are an experienced AI DevOps agent. Your main purpose is to thoroughly investigate the leading CI and DevOps best practices and detail in market tools or services that best enhance, automate, and ensure the quality of unit tests and other code quality measures."
        }
    """

def generate_summary_prompt(query, data):
    """ Generates the summary prompt for the given question and text.
    Args: question (str): The question to generate the summary prompt for
            text (str): The text to generate the summary prompt for
    Returns: str: The summary prompt for the given question and text
    """

    return f'{data}\n Using the above text, summarize it based on the following task or query: "{query}".\n If the ' \
           f'query cannot be answered using the text, YOU MUST summarize the text in short.\n Include all factual ' \
           f'information such as numbers, stats, quotes, etc if available. '

##############################################################################################

# DETAILED REPORT PROMPTS

def generate_subtopics_prompt() -> str:
    return """
                Provided the main topic:
                
                {task}
                
                and research data:
                
                {data}
                
                - Construct a list of subtopics which indicate the headers of a report document to be generated on the task. 
                - These are a possible list of subtopics : {subtopics}.
                - There should NOT be any duplicate subtopics.
                - Limit the number of subtopics to a maximum of {max_subtopics}
                - Finally order the subtopics by their tasks, in a relevant and meaningful order which is presentable in a detailed report
                
                "IMPORTANT!":
                - Every subtopic MUST be relevant to the main topic and provided research data ONLY!
                
                {format_instructions}
            """


def generate_subtopic_report_prompt(
    current_subtopic,
    existing_headers,
    main_topic,
    context,
    report_format="apa",
    total_words=1000,
    retained_text="",
    deleted_text="",
    cadence=""
) -> str:

    return f"""
    "Context":
    "{context}"
    
    "Main Topic and Subtopic":
    Using the latest information available, construct a detailed report on the subtopic: {current_subtopic} under the main topic: {main_topic}.
    ONLY USE INFORMATION PROVIDED IN THE CONTEXT TO GENERATE YOUR RESPONSE.
    This is a report on the following cadence: {cadence}, it is critical that the information is timely as of the current date provided below and only covers information from the past day, week, or month depending on the cadence.

    "Content Focus":
    - The report should focus on answering the question, be well-structured, informative, in-depth, and only contain information from sources.
    - Use markdown syntax and follow the {report_format.upper()} format.
    
    "Structure and Formatting":
    - As this sub-report will be part of a larger report, include only the main body divided into suitable subtopics without any introduction, conclusion, or reference section.
    
    - Include hyperlinks to relevant URLs wherever referenced in the report, for example:
    
        # Report Header
        
        This is a sample text. ([url website](url))
    
    "Existing Subtopic Reports":
    - This is a list of existing subtopic reports and their section headers:
    
        {existing_headers}.
    
    - Do not use any of the above headers or related details to avoid duplicates. Use smaller Markdown headers (e.g., H2 or H3) for content structure, avoiding the largest header (H1) as it will be used for the larger report's heading.
    
    "Date":
    Assume the current date is {datetime.now(timezone.utc).strftime('%B %d, %Y')} if required.
    
    "IMPORTANT!":
    - Information MUST come entirely from sources, refrain from generating information not found in the sources.
    - The focus MUST be on the main topic! You MUST Leave out any information un-related to it!
    - Must NOT have any introduction, conclusion, summary or reference section.
    """


def generate_report_introduction(question: str, research_summary: str = "", cadence: str = "") -> str:
    return f"""{research_summary}\n 
        Using ONLY the above latest information, Prepare a detailed report introduction on the topic -- {question}.
        - This is a {cadence} report, it is critical that the information is timely as of the current date provided below.
        - The introduction should be succinct, well-structured, informative with markdown syntax.
        - As this introduction will be part of a larger report, do NOT include any other sections, which are generally present in a report.
        - The introduction should be preceded by an H1 heading with a suitable topic for the entire report.
        - You must include hyperlinks with markdown syntax ([url website](url)) related to the sentences wherever necessary.
        Assume that the current date is {datetime.now(timezone.utc).strftime('%B %d, %Y')} if required.
    """

def component_injection():
    return """
    import React, { useRef, useEffect, useState } from 'react';
    import * as d3 from 'd3';
    import { IconX, IconDownload, IconRefresh } from "@tabler/icons-react";
    import { toast } from 'sonner';
    import mermaid from 'mermaid';

    mermaid.initialize({
    startOnLoad: false,
    securityLevel: 'strict',
    theme: 'default',
    logLevel: 5,
    deterministicIds: true,
    flowchart: { 
        htmlLabels: false,
        useMaxWidth: true 
    }
    });

    interface ChartCardProps {
    d3Code?: string;
    mermaidCode?: string;
    onClose: () => void;
    onRetry?: () => void;
    }

    const ChartCard: React.FC<ChartCardProps> = ({ d3Code, mermaidCode, onClose, onRetry }) => {
    const chartRef = useRef<HTMLDivElement>(null);
    const [error, setError] = useState<string | null>(null);
    const [retryCount, setRetryCount] = useState(0);
    const MAX_RETRIES = 3;

    useEffect(() => {
        if (d3Code) {
        renderChart();
        } else if (mermaidCode) {
        renderDiagram();
        }
    }, [d3Code, mermaidCode]);

    const renderChart = () => {
        if (chartRef.current && d3Code) {
        chartRef.current.innerHTML = '';
        const cleanedCode = d3Code
            .replace(/```javascript\n/, '')
            .replace(/```[\s]*$/, '')
            .trim();
        console.log("Cleaned D3 Code: ", cleanedCode);

        if ((cleanedCode.match(/{/g) || []).length !== (cleanedCode.match(/}/g) || []).length) {
            setError("Error rendering chart: Unmatched braces in the generated code.");
            return;
        }

        try {
            console.log("Executing D3 code...");

            const wrappedCode = `
            (function() {
                try {
                let svg = d3.select(container).select('svg');
                if (!svg.empty()) {
                    svg.selectAll("*").remove(); // Clear any existing chart
                } else {
                    svg = d3.select(container)
                    .append('svg')
                    .attr('width', '100%')
                    .attr('height', '100%')
                    .attr('preserveAspectRatio', 'xMidYMid meet')
                    .attr('viewBox', '0 0 600 400');
                }
                // Execute the provided D3 code
                ${cleanedCode}
                console.log('D3 code executed successfully');

                // Ensure the chart fills the container
                const chartBBox = svg.node().getBBox();
                svg.attr('viewBox', \`\${chartBBox.x} \${chartBBox.y} \${chartBBox.width} \${chartBBox.height}\`);
                } catch (error) {
                console.error('Error in D3 code:', error);
                throw error;
                }
            })();
            `;

            const executeD3Code = new Function('d3', 'container', wrappedCode);
            executeD3Code(d3, chartRef.current);

            setError(null);
            setRetryCount(0);
        } catch (error) {
            console.error('Error executing D3 code:', error);
            setError(`Error rendering chart: ${(error as Error).message}`);
            if (retryCount < MAX_RETRIES) {
            setRetryCount(prevCount => prevCount + 1);
            onRetry?.();
            } else {
            toast.error('Failed to render chart after multiple attempts. Please try again later.');
            }
        }
        } else {
        setError("Chart container not found");
        }
    };

    const cleanMermaidCode = (code: string): string => {
        let cleaned = code.replace(/^```mermaid\n/, '').replace(/```$/, '').trim();
        
        return cleaned;
    };

    const renderDiagram = async () => {
        if (chartRef.current && mermaidCode) {
        try {
            console.log('Rendering Mermaid code:', mermaidCode);

            const id = `mermaid-diagram-${Date.now()}`;

            const { svg } = await mermaid.render(id, mermaidCode);
            chartRef.current.innerHTML = svg;
            setError(null);
            setRetryCount(0);
        } catch (error) {
            console.error('Error rendering Mermaid diagram:', error);
            setError(`Error rendering diagram: ${(error as Error).message}`);
            if (retryCount < MAX_RETRIES) {
            setRetryCount(prevCount => prevCount + 1);
            onRetry?.();
            } else {
            toast.error('Failed to render diagram after multiple attempts. Please try again later.');
            }
        }
        }
    };

    const handleDownload = () => {
        if (d3Code) {
        downloadChart();
        } else if (mermaidCode) {
        downloadDiagram();
        }
    };

    const downloadChart = () => {
        const svg = chartRef.current?.querySelector('svg');
        if (svg) {
        const svgData = new XMLSerializer().serializeToString(svg);
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const img = new Image();

        img.onload = () => {
            canvas.width = img.width;
            canvas.height = img.height;
            ctx?.drawImage(img, 0, 0);
            const pngFile = canvas.toDataURL('image/png');
            const downloadLink = document.createElement('a');
            downloadLink.download = 'chart.png';
            downloadLink.href = pngFile;
            downloadLink.click();
        };

        img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)));
        } else {
        console.error('SVG element not found');
        }
    };

    const downloadDiagram = () => {
        const svg = chartRef.current?.querySelector('svg');
        if (svg) {
        const svgData = new XMLSerializer().serializeToString(svg);
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const img = new Image();

        img.onload = () => {
            canvas.width = img.width;
            canvas.height = img.height;
            ctx?.drawImage(img, 0, 0);
            const pngFile = canvas.toDataURL('image/png');
            const downloadLink = document.createElement('a');
            downloadLink.download = 'diagram.png';
            downloadLink.href = pngFile;
            downloadLink.click();
        };

        img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)));
        } else {
        console.error('SVG element not found');
        toast.error('Failed to download diagram. Please try again.');
        }
    };

    return (
        <div className="chart-container relative bg-transparent rounded-lg p-4 mt-4 w-full h-full">
        <div className="absolute top-2 right-2 flex space-x-2 z-10">
            {error && retryCount < MAX_RETRIES && (
            <button
                onClick={onRetry}
                className="p-1 rounded transition-colors hover:bg-gray-200 dark:hover:bg-stone-700"
                title="Retry"
            >
                <IconRefresh className="h-5 w-5" />
            </button>
            )}
            <button
            onClick={handleDownload}
            className="p-1 rounded transition-colors hover:bg-gray-200 dark:hover:bg-stone-700"
            title="Download as PNG"
            >
            <IconDownload className="h-5 w-5" />
            </button>
            <button
            onClick={onClose}
            className="p-1 rounded transition-colors hover:bg-gray-200 dark:hover:bg-stone-700"
            title="Close Chart"
            >
            <IconX className="h-5 w-5" />
            </button>
        </div>
        {error ? (
            <div className="text-red-500">{error}</div>
        ) : (
            <div ref={chartRef} className="chart-content w-full h-full" />
        )}
        </div>
    );
    };

    export default ChartCard;
    """