FROM python:3.10-slim-buster

WORKDIR /model

COPY music_audioset_epoch_15_esc_90.14.pt *.py ./

COPY requirements.txt ./

RUN apt-get update && \
apt-get -y install gcc && \
apt-get -y install g++ && \
apt-get -y install --reinstall build-essential

RUN pip install --upgrade pip && \
pip install -r requirements.txt

EXPOSE 5000

CMD ["python", "-m", "flask", "--app", "main", "run", "--host=0.0.0.0"]