import json
import time
import base64
import hashlib
import os
import requests

from models.alarm import CycleUnitEnum
from models.entity import EntityModel, EntityTypeEnum
from settings.constants import AIUI_APP_ID, AIUI_API_KEY


class AIUI:
    base_url = 'http://api.xfyun.cn'

    def __init__(self, app_id, api_key):
        self.app_id = app_id
        self.api_key = api_key

    def iat(self, file):
        """
        语音识别接口
        :return:
        """
        path = '/v1/aiui/v1/iat'
        if not os.path.isfile(file):
            raise FileNotFoundError('file({}) not found.'.format(file))

        with open(file, 'rb') as fp:
            data = 'data=' + base64.b64encode(fp.read()).decode('utf-8')

        params = '{"auf":"16k","aue":"raw","scene":"main"}'

        r = requests.post(self.base_url + path, headers=self.generate_header(params, data), data=data)
        print(r.json()['data'])
        return r.json()['data']['result']

    def voice_semantic(self, file):
        """
        语音语义接口
        :param file:
        :return:
        """
        path = '/v1/aiui/v1/voice_semantic'
        if not os.path.isfile(file):
            raise FileNotFoundError('file({}) not found.'.format(file))

        with open(file, 'rb') as fp:
            data = 'data=' + base64.b64encode(fp.read()).decode('utf-8')

        params = '{"auf":"16k","aue":"raw","scene":"main","userid":"user_0001"}'

        r = requests.post(self.base_url + path, headers=self.generate_header(params, data), data=data)
        print(r.text)

    def text_semantic(self, text):
        """
        文本语义接口
        :param text:
        :return: json
        rc: 应答码(response code)
        text: 用户的输入，可能和请求中的原始text不完全一致，因服务器可能会对text进行语言纠错
        vendor: 技能提供者名称
        service: 技能的全局唯一名称，一般为vendor.name
        semantic: 本次语义结构化表示
        dialog_stat: 用于客户端判断是否用新源返回数据
        moreResults: 在存在多个候选结果时，用于提供更多的结果描述
        sid: 本次服务唯一标识
        """
        path = '/v1/aiui/v1/text_semantic'
        params = '{"scene":"main","userid":"user_0001"}'
        data = 'text=' + base64.b64encode(bytes(text.encode('utf-8'))).decode('utf-8')

        r = requests.post(self.base_url + path, headers=self.generate_header(params, data), data=data)
        if r.status_code == 200 and r.json()['code'] == '00000':
            return r.json()['data'], r.json()['code']
        else:
            raise Exception(r.json()['desc'])

    def generate_header(self, params, data):
        """
        生成X-CheckSum
        :return:
        """
        current_time = str(int(time.time()))
        params = base64.b64encode(bytes(params.encode('utf-8'))).decode('utf-8')
        check_sum = hashlib.md5((self.api_key + current_time + params + data).encode('utf-8')).hexdigest()

        return {
            'X-Appid': self.app_id,
            'X-CurTime': current_time,
            'X-Param': params,
            'X-CheckSum': check_sum,
            'Content-Type': 'application/x-www-form-urlencoded',
            'charset': 'utf-8'
        }

    @staticmethod
    def aiui():
        return AIUI(app_id=AIUI_APP_ID, api_key=AIUI_API_KEY)


class AiuiIntent:
    """
    不同的意图需要不同的解析方式
    这里需要定义出提醒所需的格式

    实体对应的时间应该查询entity
    """

    @staticmethod
    def fuzzytime_content(semantic):
        fuzzytime = want = content = None

        for slot in semantic['slots']:
            if slot['name'] == 'fuzzytime':
                fuzzytime = slot['value']
            elif slot['name'] == 'want':
                want = slot['value']
            elif slot['name'] == 'content':
                content = slot['value']
            else:
                raise Exception('unhandled slot: ' + json.dumps(slot))

        print(semantic)
        assert fuzzytime
        assert content

        return {
            'text': content,
            'cycle_unit': CycleUnitEnum.NONE,
            'cycle_count': 0,
            'next_time': EntityModel.exec_by_word(fuzzytime, EntityTypeEnum.FUZZY_TIME),
        }

    @staticmethod
    def fuzzytime_festival_content(semantic):
        print(semantic)


if __name__ == '__main__':
    # aiui = AIUI(app_id=AIUI_APP_ID, api_key=AIUI_API_KEY)
    # # aiui.iat('16k.pcm')
    # result = aiui.text_semantic('等我长大了我要买车')    # 像长大了这种字眼，直接5年，也不用根据现在的年龄来看
    # # print(result)
    # semantic = result['semantic'][0]
    # getattr(AiuiIntent, semantic['intent'])(semantic)
    print(getattr(AiuiIntent, 'fuzzytime_content'))
