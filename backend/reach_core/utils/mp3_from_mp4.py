import os
from moviepy.editor import *

# TODO plenty to explore here in terms of interpreting the visual content
# and allowing users to ask questions about the video itself.
async def mp4_to_mp3(mp4_file_name: str) -> str:
    base_file_name = mp4_file_name.rsplit('.', 1)[0]
    FILETOCONVERT = VideoFileClip(mp4_file_name)
    mp3_output_path = f"{base_file_name}.mp3"
    FILETOCONVERT.audio.write_audiofile(mp3_output_path)
    FILETOCONVERT.close()

    return f"MP3 available at {mp3_output_path}"
