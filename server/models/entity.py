import enum
import json

import pendulum
from sqlalchemy import Column, Integer, TIMESTAMP, VARCHAR, Enum

from db import Base, db_session


class EntityTypeEnum(enum.Enum):
    WANT = 0
    FUZZY_TIME = 1
    FESTIVAL = 2


class EntityModel(Base):
    __tablename__ = 'entity'

    id          = Column(Integer, primary_key=True)
    type        = Column(Enum(EntityTypeEnum))
    word        = Column(VARCHAR(255), default='', nullable=False)
    alias       = Column(VARCHAR(255), default='', nullable=False)
    func        = Column(VARCHAR(255), default='', nullable=False)  # 功能，例如有加时间等的功能add_time
    args        = Column(VARCHAR(255), default='{}', nullable=False)    # 参数，例如{'days':10}
    created_at  = Column(TIMESTAMP)
    updated_at  = Column(TIMESTAMP)
    deleted_at  = Column(TIMESTAMP)

    @staticmethod
    def exec_by_word(word, type):
        entity = db_session.query(EntityModel).filter(EntityModel.word == word,
                                             EntityModel.type == type,
                                             EntityModel.deleted_at == None).first()
        method = 'func_' + entity.func
        if hasattr(EntityModel, method):
            return getattr(EntityModel, method)(**json.loads(entity.args))
        else:
            raise FileNotFoundError(f'func({method}) not found.')

    @staticmethod
    def func_add_time(years=0, months=0, days=0, hours=0, minutes=0, seconds=0):
        at = pendulum.now().add(years=years, months=months, days=days, hours=hours, minutes=minutes, seconds=seconds)
        # return at.int_timestamp() # TODO：为啥不能用
        return at.to_datetime_string()
