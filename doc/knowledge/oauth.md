# OAuth 2.0
> OAuth 2.0 is the industry-standard protocol for authorization. \
> OAuth 2.0 是业界标准的授权协议。

[OAuth 2.0](https://oauth.net/) 是一种授权协议，作为业界标准规范了授权流程。其官网内容包括：
- 🌽框架核心介绍：核心变量、授权类型、客户端类型、安全讨论、id token比较
- 📱移动端与其他设备方案规范
- 🎫Token 存储与使用建议
- 🤵客户端注册应用
- :lock: 安全提升建议
- 🔨社区和其他扩展内容等等……

:::tip 指导作用
项目实现注册功能和登录功能时，开发者可能根据经验开发，但实际上有OAuth 2.0 作为规范（🗒️理解为方案库、实现指南）。下面我将阐述常用场景和过程中必须知道的概念。
:::

## 场景概述
在OAuth 2.0 规范开发过程中，我们一般用到两个核心变量：
- accessToken： 应该是**无意义**的**短期**的**不包含任何用户信息**的字符串，格式由资源服务器定义
- refreshToken： 应该是**无意义**的**长期**的**不包含任何用户信息**的字符串，格式由资源服务器定义
:::info 双令牌流程
登陆时，服务器返回 accessToken 和 refreshToken 给客户端，客户端后续请求时，在请求头中携带 accessToken 进行访问。
当 accessToken 过期时，客户端提前使用 refreshToken 申请新的 accessToken，再发送请求。此过程用户无感知。
:::

| 更多场景   | 说明                                                                                                       |
| ---------- | ---------------------------------------------------------------------------------------------------------- |
| 授权码模式 | 客户端获取授权码，直接将授权码发送给服务器，服务器返回Token (推荐以PKCE作为安全加强)                       |
| PKCE 模式  | Proof Key for Code Exchange，密钥授权码，1. 带加密后的随机字符串获取授权码，2.授权码+原始字符串获取token码 |
| 设备授权   | 设备申请验证地址，轮询验证状态，用户验证，服务器返回 Token (跨设备验证码或者扫描模式)                      |

## JWT
JWT（JSON Web Token）是一种用于在网络应用间传递声明的开放标准（RFC 7519）。它定义了这个结构：
```js
// - header： 包含算法和令牌类型的 JSON 对象，被 Base64Url 编码
// - payload： 包含声明的 JSON 对象，被 Base64Url 编码
// - 密钥： 用于签名的密钥，服务器端保存，不能泄露
const header64 = base64UrlEncode(header)
const payload64 = base64UrlEncode(payload)
const jwtToken = header64 + "." + payload64 + "." + HMACSHA256(header64 + "." + payload64, 密钥)
// 规范中的必要字段
const payload = { 
  "sub": "user_123456",  // 核心字段：subject，规范中代表用户唯一标识（用户 ID）
  "iss": "https://your-domain.com",  // 签发者 issuer，规范中代表授权服务器
  "exp": 1740000000,  // 过期时间 Expiration Time
  "iat": 1739996800,  // 签发时间 Issued At
  "jti": "unique_token_id_123456",  // JWT 唯一标识，用于防止重放攻击
  "client_id": "web_app_001",  // 客户端 ID
}
```
:::tip 加强理解
JWT只是一种格式，而accessToken才是作为业务的令牌。整个过程中前端不需要知道accessToken的具体格式，作为理解即可。笔者似乎曾在ali-oss 移动端直传中实现使用过类似的算法。
:::