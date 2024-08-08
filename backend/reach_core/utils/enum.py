from enum import Enum

class ReportType(Enum):
    LongNewsletterReport = 'long_newsletter_report'
    NewsletterReport = 'newsletter_report'
    NewsletterParagraph = 'newsletter_paragraph'
    DetailedJson = 'detailed_json'
    Json = 'json'
    Paragraph = 'paragraph'
    ResearchReport = 'research_report'
    ResourceReport = 'resource_report'
    OutlineReport = 'outline_report'
    CustomReport = 'custom_report'
    DetailedReport = 'detailed_report'
    SubtopicReport = 'subtopic_report'
    TableReport = 'table'