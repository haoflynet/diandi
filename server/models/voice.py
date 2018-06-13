import datetime
import enum

from sqlalchemy import Column, Integer, TIMESTAMP, Text, VARCHAR, Enum, desc

from db import Base, db_session


class VoiceTypeEnum(enum.Enum):
    ALARM = 0
    RECORD = 1


class VoiceModel(Base):
    __tablename__ = 'voices'

    id              = Column(Integer, primary_key=True)
    user_id         = Column(Integer)
    text            = Column(VARCHAR(255), default='', nullable=False)
    correct_text    = Column(VARCHAR(255), default='', nullable=False)
    type            = Column(Enum(VoiceTypeEnum))
    result          = Column(Text, default='{}', nullable=False)
    result_code     = Column(VARCHAR(10), default='', nullable=False)
    created_at      = Column(TIMESTAMP)
    updated_at      = Column(TIMESTAMP)
    deleted_at      = Column(TIMESTAMP)

    @staticmethod
    def get_by_id(voice_id, user_id):
        return db_session.query(VoiceModel).filter(VoiceModel.id == voice_id,
                                                   VoiceModel.user_id == user_id,
                                                   VoiceModel.deleted_at == None).first()

    @staticmethod
    def get_list(user_id, keyword=None, type=None, page=1, limit=20):
        query = db_session.query(VoiceModel).filter(VoiceModel.user_id==user_id,
                                                    VoiceModel.deleted_at==None)
        if type is not None:
            query = query.filter(VoiceModel.type==type)
        if keyword is not None:
            query = query.filter(VoiceModel.text.like(f'%{keyword}%'))

        paginator = {
            'per_page': limit,
            'current_page': page,
        }
        return query.order_by(desc('created_at')).limit(limit).offset(limit * (page - 1)).all(), paginator

    @staticmethod
    def store(user_id, text, type='RECORD', result=None):
        voice = VoiceModel(
            user_id = user_id,
            text = text,
            type = type,
            result = result if result is not None else '',
            created_at = str(datetime.datetime.today()),
            updated_at = str(datetime.datetime.today())
        )
        db_session.add(voice)
        db_session.commit()
        return voice

    @staticmethod
    def update_by_id(voice_id, user_id, result=None):
        voice = VoiceModel.get_by_id(voice_id, user_id)
        voice.result = result if result is not None else voice.result
        db_session.commit()

    def update(self, correct_text=None, result=None, result_code=None):
        self.correct_text = correct_text if correct_text is not None else self.correct_text
        self.result = result if result is not None else self.result
        self.result_code = result_code if result_code is not None else self.result_code
        db_session.commit()


    @staticmethod
    def transform(voice):
        items = voice if isinstance(voice, list) else [voice]
        result = [{
            'id': item.id,
            'user_id': item.user_id,
            'text': item.text,
            'type': item.type.name,
            'result': item.result,
            'correct_text': item.correct_text,
            'created_at': str(item.created_at),
            'updated_at': str(item.updated_at)
        } for item in items]
        return result if isinstance(voice, list) else result[0]
