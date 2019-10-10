#import <React/RCTBridgeModule.h>
#import <React/RCTLog.h>

#import <UIKit/UIKit.h>
#import "WXApi.h"

@interface RCTWeChat : NSObject <RCTBridgeModule, WXApiDelegate>

@property NSString* appId;

@end