from handlers.alarm_handlers import AlarmHandler
from handlers.record_handlers import RecordHandler
from handlers.voice_handlers import VoiceHandler

url_patterns = [
    (r"/alarms/(?P<alarm_id>\d*)", AlarmHandler),
    (r"/records/(?P<record_id>\d*)", RecordHandler),
    (r"/voices/(?P<voice_id>\d*)", VoiceHandler),
]
