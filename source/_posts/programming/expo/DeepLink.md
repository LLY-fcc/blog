>本文设计的解决方案主要适用于以下平台：
>
>Expo

移动端常借助分享功能实现裂变，分享再打开通常有两种形式：
1、用户主动复制粘贴口令到对应的 App
2、用户点击链接跳转到浏览器，最后再跳转到 App
这里介绍第二种，目前常用的方案有 URLScheme 和 DeepLink(App Links\Universal Links)，作如下对比：

| 方案        | 复杂度 | 安全性  |
| --------- | --- | ---- |
| URLScheme | 简洁  | 安全性差 |
| DeepLink  | 复杂  | 安全性强 |

建议应用的快速试错阶段使用 URLScheme，等到稳定迭代阶段转换为 DeepLink，分别介绍如下：

## URLScheme
在 `app.config.js` 中可以配置 `scheme`：

```js
export default {
  expo: {
    scheme: "scheme",
    // 其他配置...
  },
};
```

配置 `scheme` 意味着向系统表明，自己可以处理这些私有协议。与常见的 HTTP 协议的地址以 http\https 开头类似，私有协议的名字也作为 URI 的起始值。

`expo-router` 会监听私有协议的触发动作，并自动校验私有协议地址是否命中项目结构，如果命中，则会传递 URI 到对应的组件（页面）进行处理，例如，对于 ‘`scheme`:/from/share?params=xxx' 则会尝试命中如下页面结构：

```bash
# ...
- app # 根据配置不同，可能不同
	  from
		  share.tsx
# ...
```

一个值得注意的问题是，系统并不限制相同的 `scheme` 只能被一个 APP 注册，这就意味着，如果你注册的 `scheme` 也可以被其它 APP 注册，使用 DeepLink 可以避免这个问题。
## DeepLink
deeplink 在不同的平台名称不一致：

| Platform | Name            |
| -------- | --------------- |
| IOS      | Universal Links |
| Android  | App Links       |

不过其本质是相同的，且都需要在客户端和服务器进行复杂的配置，客户端配置示例：

```js
// app.config.js 示例（DeepLink）
export default {
  expo: {
    associatedDomains: ['applinks:yourdomain.com'],  // iOS
    intentFilters: [{
      action: 'VIEW',
      data: [
		{
			scheme: 'https',
			host: 'yourdomain.com'
		}
      ],
      category: ['BROWSABLE', 'DEFAULT']
    }]  // Android
  }
};
```

如上所示，这是最基本的配置，更多进阶配置请移步 [expo](https://docs.expo.dev/versions/latest/config/app/)。
也就是说，在使用 deeplink 前还需要准备好域名，准备好后我们还需要按照不同平台的要求在服务器的特定目录准备好服务端配置文件，且都要放在网站根目录下的 `.well-known` 文件夹内，不同平台的配置文件名如下：

| Platform | Name                       | Note       |
| -------- | -------------------------- | ---------- |
| IOS      | apple-app-site-association | json 文件无后缀 |
| Android  | assetlinks.json            |            |

IOS 模版：

```json
{
  "applinks": {
    "apps": [],
    "details": [
      {
        "appID": "TEAMID.com.yourapp.main",  // TEAMID 从 Apple Developer 获取
        "paths": ["/from/share", "/from/*"]
      }
    ]
  }
}
```


Android 模版：
```json
[{
  "relation": ["delegate_permission/common.handle_all_urls"],
  "target": {
    "namespace": "android_app",
    "package_name": "com.yourapp.main",
    "sha256_cert_fingerprints": ["你的 App SHA256 指纹"]  // 从 EAS Build 或 Play Console 获取
  }
}]
```

上述的配置是最简洁、最基本的格式，可以开箱即用，有特殊需求还需移步 Google 解锁进阶配置。
这里需要注意两点，`appID` 和 `sha256_cert_fingerprints`，IOS 平台的 `appID` 是由 `TEAMID` 和 `package_name` 组成的；Android 平台要求的 `sha256_cert_fingerprints` 可以通过 Google Play Console 或 Expo cli