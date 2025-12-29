/**
 * Linux DO Credit 支付回调处理
 * 接收支付成功通知并更新订单状态
 */

import { NextRequest, NextResponse } from "next/server";
import { verifySign, type NotifyParams } from "@/lib/payment/ldc";
import { handlePaymentSuccess } from "@/lib/actions/orders";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;

  // 提取回调参数
  const params: NotifyParams = {
    pid: searchParams.get("pid") || "",
    trade_no: searchParams.get("trade_no") || "",
    out_trade_no: searchParams.get("out_trade_no") || "",
    type: searchParams.get("type") || "",
    name: searchParams.get("name") || "",
    money: searchParams.get("money") || "",
    trade_status: searchParams.get("trade_status") || "",
    sign_type: searchParams.get("sign_type") || "",
    sign: searchParams.get("sign") || "",
  };

  // 验证必要参数
  if (!params.out_trade_no || !params.sign) {
    console.error("支付回调缺少必要参数:", params);
    return new NextResponse("fail", { status: 400 });
  }

  // 验证签名
  const secret = process.env.LDC_SECRET;
  if (!secret) {
    console.error("LDC_SECRET 未配置");
    return new NextResponse("fail", { status: 500 });
  }

  if (!verifySign(params, secret)) {
    console.error("支付回调签名验证失败:", params);
    return new NextResponse("fail", { status: 400 });
  }

  // 验证交易状态
  if (params.trade_status !== "TRADE_SUCCESS") {
    console.log("交易状态非成功:", params.trade_status);
    return new NextResponse("success");
  }

  // 处理支付成功
  try {
    const result = await handlePaymentSuccess(params.out_trade_no, params.trade_no);

    if (result) {
      console.log("订单支付成功处理完成:", params.out_trade_no);
      return new NextResponse("success");
    } else {
      console.error("订单处理失败:", params.out_trade_no);
      return new NextResponse("fail", { status: 500 });
    }
  } catch (error) {
    console.error("处理支付回调异常:", error);
    return new NextResponse("fail", { status: 500 });
  }
}

