FROM python:3.10

WORKDIR /model

COPY music_audioset_epoch_15_esc_90.14.pt ./model/
COPY *.py ./

COPY requirements.txt ./

RUN apt-get update && \
apt-get -y install --reinstall build-essential && \
apt-get -y install ffmpeg && \
apt-get -y install libsndfile1

RUN pip install --upgrade pip && \
pip install -r requirements.txt

RUN mkdir db
RUN chmod 777 db

EXPOSE 5000

CMD ["python", "-m", "flask", "--app", "main", "run", "--host=0.0.0.0"]