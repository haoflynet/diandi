import datetime
import enum

from sqlalchemy import Column, Integer, Enum, Boolean, TIMESTAMP

from db import Base, db_session


class CycleUnitEnum(enum.Enum):
    NONE = 0
    MINUTE = 1
    HOUR = 2
    DAY = 3
    MONTH = 4
    YEAR = 5


class AlarmModel(Base):
    __tablename__ = 'alarms'

    id = Column(Integer, primary_key=True)
    user_id     = Column(Integer)
    voice_id    = Column(Integer)
    cycle_unit  = Column(Enum(CycleUnitEnum))
    cycle_count = Column(Integer)
    next_time   = Column(TIMESTAMP)
    expired     = Column(Boolean, default=0)
    created_at  = Column(TIMESTAMP)
    updated_at  = Column(TIMESTAMP)
    deleted_at  = Column(TIMESTAMP)

    @staticmethod
    def get_by_id(alarm_id, user_id):
        return db_session.query(AlarmModel).filter(AlarmModel.id == alarm_id,
                                                   AlarmModel.user_id == user_id,
                                                   AlarmModel.deleted_at == None).first()

    @staticmethod
    def delete_by_id(alarm_id, user_id):
        alarm = AlarmModel.get_by_id(alarm_id=alarm_id, user_id=user_id)
        alarm.deleted_at = str(datetime.datetime.today())
        db_session.commit()

    @staticmethod
    def update_by_id(alarm_id, user_id, cycle_unit=None, cycle_count=None, next_time=None, expired=None):
        alarm = AlarmModel.get_by_id(alarm_id, user_id)
        alarm.cycle_unit = cycle_unit if cycle_unit is not None else alarm.cycle_unit
        alarm.cycle_count = cycle_count if cycle_count is not None else alarm.cycle_count
        alarm.next_time = next_time if next_time is not None else alarm.next_time
        alarm.updated_at = str(datetime.datetime.today())
        if expired is not None:
            print(expired)
            alarm.expired = False if expired in [0, False, 'false', 'False', '0'] else True
        db_session.commit()

    @staticmethod
    def get_list(db_session, user_id):
        return db_session.query(AlarmModel).filter(AlarmModel.user_id==user_id,
                                                   AlarmModel.deleted_at == None).all()

    @staticmethod
    def store(db_session, user_id, cycle_unit, cycle_count, next_time, voice_id=0):
        alarm = AlarmModel(
            user_id = user_id,
            voice_id = voice_id,
            cycle_unit = CycleUnitEnum[cycle_unit],
            cycle_count = cycle_count,
            next_time = next_time,
            created_at = str(datetime.datetime.today()),
            updated_at = str(datetime.datetime.today())
        )
        db_session.add(alarm)
        db_session.commit()

    @staticmethod
    def transform(alarm):
        items = alarm if isinstance(alarm, list) else [alarm]
        result = [{
            'id': item.id,
            'user_id': item.user_id,
            'voice_id': item.voice_id,
            'cycle_unit': item.cycle_unit.value,
            'cycle_count': item.cycle_count,
            'expired': item.expired,
            'next_time': str(item.next_time),
            'created_at': str(item.created_at),
            'updated_at': str(item.updated_at)} for item in items]
        return result if isinstance(alarm, list) else result[0]
