import { formateDate } from 'utils/index'

const vfilter = {
  formatDate: function (value) {
    if (value) return ""
    return formateDate(value);
  },
  formatter: function (value, that) {
    if (value.indexOf("-9999") > -1) {
      return '--'
    }
    return value
  },
}
export default vfilter