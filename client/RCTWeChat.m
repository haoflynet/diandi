#import "RCTWeChat.h"
#import "WXApiObject.h"

@implementation RCTWeChat

RCT_EXPORT_MODULE();

RCT_EXPORT_METHOD(getApiVersion:(RCTResponseSenderBlock)callback)
{
    callback(@[[NSNull null], [WXApi getApiVersion]]);
}

@end
