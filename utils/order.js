const STATUS_WAITPAY = 0; //待支付
const STATUS_PAYED = 1; //已支付
const STATUS_PAY_FAIL = 2; //支付失败
const STATUS_COMPLETED = 15; //已完成
const STATUS_CANCELED = 30; //已取消
const STATUS_INVALID = 99; //已作废，由后台人员手动取消

const STATUS_NAME_MAP = {};
STATUS_NAME_MAP[STATUS_WAITPAY] = '待支付';
STATUS_NAME_MAP[STATUS_PAYED] = '已支付';
STATUS_NAME_MAP[STATUS_PAY_FAIL] = '支付失败';
STATUS_NAME_MAP[STATUS_COMPLETED] = '已完成';
STATUS_NAME_MAP[STATUS_CANCELED] = '已取消';
STATUS_NAME_MAP[STATUS_INVALID] = '已作废';

const getStatusText = function(status_value) {
  return STATUS_NAME_MAP[status_value];
}

module.exports = {
  STATUS_WAITPAY,
  STATUS_PAYED,
  STATUS_PAY_FAIL,
  STATUS_COMPLETED,
  STATUS_CANCELED,
  STATUS_INVALID,
  STATUS_NAME_MAP,
  getStatusText
}