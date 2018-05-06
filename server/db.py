from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, scoped_session

from settings import constants

engine = create_engine(constants.DB_ENGINE)
session_factory = sessionmaker(bind=engine)
DB_Session = scoped_session(sessionk_factory)