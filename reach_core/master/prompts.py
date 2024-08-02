import json
from typing import List
from datetime import datetime, timezone

from reach_core.utils.enum import ReportType

def generate_search_queries_prompt(question: str, parent_query: str, report_type: str, uploaded_files: List[str], max_iterations: int=3, retained_text="", deleted_text="") -> str:
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

    prompt = {
        "task": f"Write {max_iterations} google search queries to search online that form an objective opinion from the following task: \"{task}\", while taking into account the user_collected_info",
        "user_collected_info": f"The user has the existing data: {retained_text}, and has indicated they did not find the following data useful: {deleted_text}",
        "date_needed": f"Use the current date if needed: {datetime.now().strftime('%B %d, %Y')}.",
        "files_info": f"Files can be present and questions can be asked about them. Uploaded files if any: {uploaded_files}",
        "additional_instructions": "Also include in the queries specified task details such as locations, names, etc. user_collected_info should heavily influence the direction of the search queries, enrich the existing detail and reach for new information not contained in either the existing or unliked data.",
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


def generate_report_prompt(question, context, report_format="apa", total_words=2000, retained_text="", deleted_text=""):
    """ Generates the report prompt for the given question and research summary.
    Args: question (str): The question to generate the report prompt for
            research_summary (str): The research summary to generate the report prompt for
    Returns: str: The report prompt for the given question and research summary
    """

    return f'Information: """{context}""" The user already has the following information in their report: EXISTING REPORT """{retained_text}""" and does not wish to see information similar to REMOVED SECTIONS """{deleted_text}"""\n' \
           f'Using ONLY the above information, answer the following' \
           f' query or task: "{question}" in a detailed report --' \
           " The report should focus on the answer to the query, should be well structured, informative," \
           f" in depth and comprehensive, with facts and numbers if available and a minimum of {total_words} words.\n" \
           "You should strive to write the report as long as you can using all relevant and necessary information provided, preserving the existing report and adding rich details.\n" \
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
            f"Please do your best, this is very important to my career. " \
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

def get_report_by_type(report_type, retained_text="", deleted_text=""):
     report_type_mapping = {
        ReportType.DetailedJson.value:generate_detailed_json_prompt,
        ReportType.Json.value: generate_json_prompt,
        ReportType.Paragraph.value: generate_paragraph_prompt,
        ReportType.ResearchReport.value: generate_report_prompt(retained_text=retained_text, deleted_text=deleted_text),
        ReportType.ResourceReport.value: generate_resource_report_prompt,
        ReportType.OutlineReport.value: generate_outline_report_prompt,
        ReportType.CustomReport.value: generate_custom_report_prompt,
        ReportType.SubtopicReport.value: generate_subtopic_report_prompt,
        ReportType.TableReport.value: generate_table_prompt
     }
     return report_type_mapping[report_type]


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
) -> str:

    return f"""
    "Context":
    "{context}"
    
    "Main Topic and Subtopic":
    Using the latest information available, construct a detailed report on the subtopic: {current_subtopic} under the main topic: {main_topic}.
    ONLY USE INFORMATION PROVIDED IN THE CONTEXT TO GENERATE YOUR RESPONSE
    
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


def generate_report_introduction(question: str, research_summary: str = "") -> str:
    return f"""{research_summary}\n 
        Using ONLY the above latest information, Prepare a detailed report introduction on the topic -- {question}.
        - The introduction should be succinct, well-structured, informative with markdown syntax.
        - As this introduction will be part of a larger report, do NOT include any other sections, which are generally present in a report.
        - The introduction should be preceded by an H1 heading with a suitable topic for the entire report.
        - You must include hyperlinks with markdown syntax ([url website](url)) related to the sentences wherever necessary.
        Assume that the current date is {datetime.now(timezone.utc).strftime('%B %d, %Y')} if required.
    """

