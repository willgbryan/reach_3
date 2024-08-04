# import os
# from hubspot import HubSpot
# from typing import List, Dict, Any

# #TODO there are likely more integrations to add here, currently only the crm objects that support a get_all() method are collected.

# async def process_hubspot_crm_objects(credentials: str) -> List[Dict[Any, Any]]:
    
#     """Returned objects need to be ~unpacked~ with a to_dict() method."""

#     api_client = HubSpot()
#     api_client.access_token = credentials

#     output_list = []

#     available_objects = [
#         "calls",
#         "communications",
#         "emails",
#         "feedback_submissions",
#         "goals",
#         "meetings",
#         "notes",
#         "postal_mail",
#         "tasks",
#         "taxes",
#     ]

#     try:
#         if (all_contacts := api_client.crm.contacts.get_all()):
#             output_list.extend([{'url': 'hubspot_contacts', 'raw_content': str(contact.to_dict())} for contact in all_contacts])
#     except Exception as e:
#         print(f"Failed to fetch contacts: {e}")
    
#     try:
#         if (all_products := api_client.crm.products.get_all()):
#             output_list.extend([{'url': 'hubspot_products', 'raw_content': str(product.to_dict())} for product in all_products])
#     except Exception as e:
#         print(f"Failed to fetch products: {e}")

#     try:
#         if (all_companies := api_client.crm.companies.get_all()):
#             output_list.extend([{'url': 'hubspot_companies', 'raw_content': str(company.to_dict())} for company in all_companies])
#     except Exception as e:
#         print(f"Failed to fetch companies: {e}")

#     try:
#         if (all_deals := api_client.crm.deals.get_all()):
#             output_list.extend([{'url': 'hubspot_deals', 'raw_content': str(deal.to_dict())} for deal in all_deals])
#     except Exception as e:
#         print(f"Failed to fetch deals: {e}")

#     try:
#         if (all_tickets := api_client.crm.tickets.get_all()):
#             output_list.extend([{'url': 'hubspot_tickets', 'raw_content': str(ticket.to_dict())} for ticket in all_tickets])
#     except Exception as e:
#         print(f"Failed to fetch tickets: {e}")

#     try:
#         if (all_line_items := api_client.crm.line_items.get_all()):
#             output_list.extend([{'url': 'hubspot_line_items', 'raw_content': str(line_item.to_dict())} for line_item in all_line_items])
#     except Exception as e:
#         print(f"Failed to fetch line_items: {e}")
    
#     try:
#         if (all_owners := api_client.crm.owners.get_all()):
#             output_list.extend([{'url': 'hubspot_owners', 'raw_content': str(owner.to_dict())} for owner in all_owners])
#     except Exception as e:
#         print(f"Failed to fetch owners: {e}")

#     for object_type in available_objects:
#         try:
#             if (all_objects := api_client.crm.objects.get_all(object_type = object_type)):
#                 output_list.extend([{'url': 'hubspot_objects', 'raw_content': str(object.to_dict())} for object in all_objects])
#         except Exception as e:
#             print(f"Failed to fetch {object_type}: {e}")
    

#     print(f"content: {output_list}")
#     return output_list
