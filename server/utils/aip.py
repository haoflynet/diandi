import os

from aip import AipSpeech

from settings.constants import AIP_APP_ID, AIP_API_KEY, AIP_SECRET_KEY


class AIP:
    """
    百度语音开放平台
    """

    def __init__(self, app_id, api_key, secret_key):
        self.app_id = app_id
        self.api_key = api_key
        self.secret_key = secret_key

        self.client = AipSpeech(app_id, api_key, secret_key)

    def asr(self, file):
        if not os.path.isfile(file):
            raise FileNotFoundError('file not found.')

        with open(file, 'rb') as fp:
            data = fp.read()

        result = self.client.asr(data, 'pcm', 16000, {
            'lan': 'zh'
        })

        print(result)

if __name__ == '__main__':
    aip = AIP(app_id=AIP_APP_ID, api_key=AIP_API_KEY, secret_key=AIP_SECRET_KEY)
    aip.asr('16.pcm')
