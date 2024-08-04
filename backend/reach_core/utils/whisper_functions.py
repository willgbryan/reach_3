# import os
# import whisper
# from typing import List, Dict

# async def parse_text_from_audio(upload_dir: str = "uploads", model: str = "base") -> List[Dict[str, str]]:
#     """
#     Function for creating a list of source and contents (text) given an input .mp3, .wav, or .flac

#     Models: 
#     Size	Parameters	English-only model	Multilingual model	Required VRAM	Relative speed
#     tiny	39 M	    tiny.en	            tiny	            ~1 GB	        ~32x
#     base	74 M	    base.en	            base	            ~1 GB	        ~16x
#     small	244 M	    small.en	        small	            ~2 GB	        ~6x
#     medium	769 M	    medium.en	        medium	            ~5 GB	        ~2x
#     large	1550 M	    N/A	                large	            ~10 GB	        1x

#     Args:
#         upload_dir (str) upload directory containing uploads "uploads/filename".
#         model (str) name of the model, default is "base".
#     """
#     output_list = []
#     if os.path.exists(upload_dir):
#         for filename in os.listdir(upload_dir):
#             file_path = os.path.join(upload_dir, filename)
#             if os.path.isfile(file_path) and file_path.endswith(('.mp3', '.wav', '.flac')):
#                 model = whisper.load_model("tiny")
#                 result = model.transcribe(file_path)
#                 raw_content = result["text"]
#                 output_list.append({'url': file_path, 'raw_content': raw_content})
#     else:
#         print(f"No audio uploads found.")
    
#     return output_list