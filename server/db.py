from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, scoped_session

from settings import constants

engine = create_engine(constants.DB_ENGINE, echo=False)
session_factory = sessionmaker(bind=engine)
DB_Session = scoped_session(session_factory)