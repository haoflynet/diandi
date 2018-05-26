import datetime
import enum

from sqlalchemy import Column, Integer, TIMESTAMP, Text, VARCHAR, Enum

from db import Base, db_session


class VoiceTypeEnum(enum.Enum):
    RECORD = 0
    ALARM = 1


class VoiceModel(Base):
    __tablename__ = 'voices'

    id = Column(Integer, primary_key=True)
    user_id     = Column(Integer)
    text        = Column(VARCHAR(255), default='', nullable=False)
    result      = Column(Text)
    created_at  = Column(TIMESTAMP)
    updated_at  = Column(TIMESTAMP)
    deleted_at  = Column(TIMESTAMP)

    @staticmethod
    def get_by_id(db_session, voice_id, user_id):
        return db_session.query(VoiceModel).filter(VoiceModel.id == voice_id,
                                                   VoiceModel.user_id == user_id,
                                                   VoiceModel.deleted_at == None).first()

    @staticmethod
    def get_list(db_session, user_id):
        return db_session.query(VoiceModel).filter(VoiceModel.user_id == user_id,
                                                   VoiceModel.deleted_at == None).all()

    @staticmethod
    def store(db_session, user_id, text, result=None):
        voice = VoiceModel(
            user_id = user_id,
            text = text,
            result = result if result is not None else '',
            created_at = str(datetime.datetime.today()),
            updated_at = str(datetime.datetime.today())
        )
        db_session.add(voice)
        db_session.commit()

    @staticmethod
    def update_by_id(db_session, voice_id, result=None):
        voice = VoiceModel.get_by_id(db_session, voice_id)
        voice.result = result if result is not None else voice.result
        db_session.commit()

    @staticmethod
    def transform(voice):
        items = voice if isinstance(voice, list) else [voice]
        result = [{
            'id': item.id,
            'user_id': item.user_id,
            'text': item.text,
            'result': item.result,
            'created_at': str(item.created_at),
            'updated_at': str(item.updated_at)
        } for item in items]
        return result if isinstance(voice, list) else result[0]
