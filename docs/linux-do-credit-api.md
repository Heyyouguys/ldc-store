# LINUX DO Credit API 接口文档

> 来源: https://credit.linux.do/docs/api  
> 最后更新: 2025-12-28

LINUX DO Credit 提供简单、强大的 API 接口，支持多种编程语言和开发环境。通过标准化的 HTTP 接口，您可以轻松将积分服务集成到您的应用中。

---

## 1. 官方服务接口

官方服务接口暂未上线，敬请期待。

---

## 2. 易支付兼容接口

兼容易支付、CodePay、VPay 等支付协议。

### 2.1 概览

| 配置项 | 说明 |
|--------|------|
| **协议** | EasyPay / CodePay / VPay 兼容协议 |
| **服务类型** | 仅支持 `type=epay` |
| **网关基址** | `https://credit.linux.do/epay` |
| **订单有效期** | 取系统配置 `merchant_order_expire_minute`（平台端设置）|

### 2.2 常见错误

| 错误信息 | 说明 |
|----------|------|
| 不支持的请求类型 | `type` 仅允许 `epay` |
| 签名验证失败 | 参与签名字段与请求体需一致，密钥直接拼接 |
| 金额必须大于0 / 积分小数位数不能超过2位 | 金额格式错误 |
| 订单已过期 | 超出系统配置有效期 |
| 订单不存在或已完成 | 订单号错误、已退回或已完成 |
| 余额不足 | 余额退回时用户积分不足 |

### 2.3 对接流程

1. 控制台创建 API Key，记录 `pid`、`key`，配置回调地址
2. 按"签名算法"生成 `sign`，调用 `/pay/submit.php` 创建积分流转服务并跳转认证界面
3. 可通过 `/api.php` 轮询结果，或等待异步回调
4. 退回服务时，携带同一 `trade_no` 和原积分数量，调用积分退回接口
5. 回调验签通过后返回 `success` 完成闭环

### 2.4 鉴权与签名

#### 2.4.1 API Key

| 参数 | 说明 |
|------|------|
| `pid` | Client ID |
| `key` | Client Secret（妥善保管）|
| `notify_url` | 回调地址，使用创建应用时设置的 `notify_url`；请求体中的 `notify_url` 仅参与签名，不会覆盖创建应用时设置的 `notify_url` |

#### 2.4.2 签名算法

1. 取所有非空字段（排除 `sign`、`sign_type` 字段）
2. 将上述字段按 ASCII 升序，依次拼成 `k1=v1&k2=v2`
3. 在末尾追加应用密钥：`k1=v1&k2=v2{secret}`
4. 整体进行 MD5，取小写十六进制作为 `sign`

**签名示例（Bash）：**

```bash
payload="money=10&name=Test&out_trade_no=M20250101&pid=001&type=epay"
sign=$(echo -n "${payload}${SECRET}" | md5)  # 输出小写
```

**签名示例（TypeScript）：**

```typescript
import crypto from 'crypto';

interface PaymentParams {
  pid: string;
  type: string;
  out_trade_no?: string;
  name: string;
  money: string;
  notify_url?: string;
  return_url?: string;
  device?: string;
}

function generateSign(params: PaymentParams, secret: string): string {
  // 1. 过滤空值，排除 sign 和 sign_type
  const filteredParams = Object.entries(params)
    .filter(([key, value]) => value !== undefined && value !== '' && key !== 'sign' && key !== 'sign_type')
    .sort(([a], [b]) => a.localeCompare(b)); // 2. ASCII 升序排序

  // 3. 拼接成 k1=v1&k2=v2 格式
  const queryString = filteredParams
    .map(([key, value]) => `${key}=${value}`)
    .join('&');

  // 4. 追加密钥并 MD5
  const signStr = queryString + secret;
  return crypto.createHash('md5').update(signStr).digest('hex');
}
```

### 2.5 积分流转服务（创建支付）

- **方法**: `POST /pay/submit.php`
- **编码**: `application/x-www-form-urlencoded`
- **成功**: 验签通过后，平台自动创建积分流转服务，并跳转到认证界面（`Location=https://credit.linux.do/paying?order_no=...`）
- **失败**: 返回 JSON `{"error_msg":"...", "data":null}`

#### 请求参数

| 参数 | 必填 | 说明 |
|------|------|------|
| `pid` | 是 | Client ID |
| `type` | 是 | 固定 `epay` |
| `out_trade_no` | 否 | 业务单号，建议全局唯一 |
| `name` | 是 | 标题，最多 64 字符 |
| `money` | 是 | 积分数量，最多 2 位小数 |
| `notify_url` | 否 | 仅参与签名，不会覆盖创建应用时设置的 notify_url |
| `return_url` | 否 | 仅参与签名，不会覆盖创建应用时设置的 return_url |
| `device` | 否 | 终端标识，可选 |
| `sign` | 是 | 按"签名算法"生成 |
| `sign_type` | 否 | 固定 `MD5` |

#### 请求示例

```bash
curl -X POST https://credit.linux.do/epay/pay/submit.php \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "pid=001&type=epay&out_trade_no=M20250101&name=Test&money=10&sign=xxx&sign_type=MD5"
```

### 2.6 订单查询

- **方法**: `GET /api.php`
- **认证**: `pid` + `key`
- **说明**: `trade_no` 必填；`out_trade_no` 可选；`act` 可传 `order`，后端不强校验

#### 请求参数

| 参数 | 必填 | 说明 |
|------|------|------|
| `act` | 否 | 可选字段，建议 `order` |
| `pid` | 是 | Client ID |
| `key` | 是 | Client Secret |
| `trade_no` | 是 | 编号（平台订单号）|
| `out_trade_no` | 否 | 业务单号 |

#### 成功响应

```json
{
  "code": 1,
  "msg": "查询订单号成功!",
  "trade_no": "M20250101",
  "out_trade_no": "M20250101",
  "type": "epay",
  "pid": "001",
  "addtime": "2025-01-01 12:00:00",
  "endtime": "2025-01-01 12:01:30",
  "name": "Test",
  "money": "10",
  "status": 1
}
```

**说明**:
- `status`: `1` = 成功，`0` = 失败/处理中
- 不存在会返回 HTTP 404 且 `{"code":-1,"msg":"服务不存在或已完成"}`

### 2.7 订单退款

- **方法**: `POST /api.php`
- **编码**: `application/json` 或 `application/x-www-form-urlencoded`
- **限制**: 仅支持对已成功的积分流转服务进行积分的**全额退回**

#### 请求参数

| 参数 | 必填 | 说明 |
|------|------|------|
| `pid` | 是 | Client ID |
| `key` | 是 | Client Secret |
| `trade_no` | 是 | 编号（平台订单号）|
| `money` | 是 | 必须等于原积分流转服务的积分数量 |
| `out_trade_no` | 否 | 业务单号（兼容）|

#### 响应

```json
{ "code": 1, "msg": "退款成功" }
```

**常见失败**: 服务不存在/未认证、金额不合法（<=0 或小数超过 2 位）。

### 2.8 异步通知（认证成功）

- **触发**: 认证成功后；失败自动重试，最多 5 次（单次 30s 超时）
- **目标**: 创建应用时设置的 `notify_url`
- **方式**: HTTP GET

#### 回调参数

| 参数 | 说明 |
|------|------|
| `pid` | Client ID |
| `trade_no` | 编号（平台订单号）|
| `out_trade_no` | 业务单号 |
| `type` | 固定 `epay` |
| `name` | 标题 |
| `money` | 积分数量，最多 2 位小数 |
| `trade_status` | 固定 `TRADE_SUCCESS` |
| `sign_type` | `MD5` |
| `sign` | 按"签名算法"生成 |

#### 响应要求

应用需返回 HTTP 200 且响应体为 `success`（大小写不敏感），否则视为失败并继续重试。

#### 验签示例（TypeScript）

```typescript
import crypto from 'crypto';

interface NotifyParams {
  pid: string;
  trade_no: string;
  out_trade_no: string;
  type: string;
  name: string;
  money: string;
  trade_status: string;
  sign_type: string;
  sign: string;
}

function verifySign(params: NotifyParams, secret: string): boolean {
  const { sign, sign_type, ...rest } = params;
  
  // 过滤空值并排序
  const sortedParams = Object.entries(rest)
    .filter(([_, value]) => value !== undefined && value !== '')
    .sort(([a], [b]) => a.localeCompare(b));

  // 拼接字符串
  const queryString = sortedParams
    .map(([key, value]) => `${key}=${value}`)
    .join('&');

  // 计算签名
  const expectedSign = crypto
    .createHash('md5')
    .update(queryString + secret)
    .digest('hex');

  return sign === expectedSign;
}
```

---

## 附录：完整支付流程示例

```typescript
// 1. 创建支付订单
async function createPayment(orderId: string, amount: number, productName: string) {
  const params = {
    pid: process.env.LDC_PID!,
    type: 'epay',
    out_trade_no: orderId,
    name: productName,
    money: amount.toFixed(2),
    notify_url: 'https://your-domain.com/api/payment/notify',
    return_url: 'https://your-domain.com/payment/success',
  };

  const sign = generateSign(params, process.env.LDC_SECRET!);

  const formData = new URLSearchParams({
    ...params,
    sign,
    sign_type: 'MD5',
  });

  // 发起请求，获取跳转 URL
  const response = await fetch('https://credit.linux.do/epay/pay/submit.php', {
    method: 'POST',
    body: formData,
    redirect: 'manual', // 不自动跟随重定向
  });

  if (response.status === 302) {
    return response.headers.get('Location'); // 返回支付页面 URL
  }

  const error = await response.json();
  throw new Error(error.error_msg);
}

// 2. 处理异步通知
async function handleNotify(params: NotifyParams) {
  // 验证签名
  if (!verifySign(params, process.env.LDC_SECRET!)) {
    throw new Error('Invalid signature');
  }

  // 验证订单状态
  if (params.trade_status !== 'TRADE_SUCCESS') {
    throw new Error('Trade not success');
  }

  // 更新订单状态
  await updateOrderStatus(params.out_trade_no, 'paid');

  // 返回 success
  return 'success';
}

// 3. 查询订单
async function queryOrder(tradeNo: string) {
  const params = new URLSearchParams({
    act: 'order',
    pid: process.env.LDC_PID!,
    key: process.env.LDC_SECRET!,
    trade_no: tradeNo,
  });

  const response = await fetch(`https://credit.linux.do/epay/api.php?${params}`);
  return response.json();
}

// 4. 退款
async function refundOrder(tradeNo: string, money: string) {
  const response = await fetch('https://credit.linux.do/epay/api.php', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      pid: process.env.LDC_PID!,
      key: process.env.LDC_SECRET!,
      trade_no: tradeNo,
      money,
    }),
  });
  return response.json();
}
```

---

## 环境变量配置

```env
# LINUX DO Credit 配置
LDC_PID=your_client_id
LDC_SECRET=your_client_secret
```

