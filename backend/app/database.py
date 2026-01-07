from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# Your direct Render External URL
SQLALCHEMY_DATABASE_URL = "postgresql://inventory_mibz_user:SYkAZU4KmHf4QIqQPPBtxgApAUC4e4NU@dpg-d5dem8i4d50c73f6muqg-a.oregon-postgres.render.com/inventory_mibz"

# Create the engine for PostgreSQL
engine = create_engine(SQLALCHEMY_DATABASE_URL)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()