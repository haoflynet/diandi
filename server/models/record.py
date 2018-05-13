import datetime
import json

from sqlalchemy import Column, Integer, TIMESTAMP, Text
from tornado_sqlalchemy import declarative_base

# from . import VoiceModel
from models.voice import VoiceModel

DeclarativeBase = declarative_base()


class RecordModel(DeclarativeBase):
    __tablename__ = 'records'

    id          = Column(Integer, primary_key=True)
    user_id     = Column(Integer)
    voice_id    = Column(Integer)
    words       = Column(Text)
    created_at  = Column(TIMESTAMP)
    updated_at  = Column(TIMESTAMP)
    deleted_at  = Column(TIMESTAMP)

    @staticmethod
    def get_by_id(db_session, record_id, user_id):
        return db_session.query(RecordModel).filter(RecordModel.id == record_id,
                                                    RecordModel.user_id == user_id,
                                                    RecordModel.deleted_at == None).first()

    @staticmethod
    def get_list(db_session, user_id):
        return db_session.query(RecordModel).filter(RecordModel.user_id == user_id,
                                                    RecordModel.deleted_at == None).all()

    @staticmethod
    def store(db_session, user_id, voice_id, words):
        record = RecordModel(
            user_id = user_id,
            voice_id = voice_id,
            words = words,
            created_at = str(datetime.datetime.today()),
            updated_at = str(datetime.datetime.today())
        )
        db_session.add(record)
        db_session.commit()

    @staticmethod
    def update_by_id(db_session, record_id, user_id, text=None):
        # TODO: 可以单独添加修正表
        record = RecordModel.get_by_id(db_session, record_id=record_id, user_id=user_id)
        voice = VoiceModel.get_by_id(db_session, voice_id=record.voice_id, user_id=user_id)

        if text is not None:
            voice.text = text
            record.word = text
            voice.updated_at = str(datetime.datetime.today())
            record.updated_at = str(datetime.datetime.today())

        db_session.commit()

    @staticmethod
    def transform(record, db_session, user_id):
        items = record if isinstance(record, list) else [record]
        results = []
        for item in items:
            voice = VoiceModel.get_by_id(db_session=db_session, voice_id=item.voice_id, user_id=user_id)

            results.append({
                'id': item.id,
                'user_id': item.user_id,
                'voice': VoiceModel.transform(voice),
                'words': item.words,
                'created_at': str(item.created_at),
                'updated_at': str(item.updated_at)
            })
        return results if isinstance(record, list) else results[0]

    @staticmethod
    def delete_by_id(db_session, record_id, user_id):
        voice = RecordModel.get_by_id(db_session, record_id=record_id, user_id=user_id)
        voice.deleted_at = str(datetime.datetime.today())
        db_session.commit()
