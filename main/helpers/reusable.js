export const checkingObjectId = val => {
  const checkFormat = /^(?=[a-f\d]{24}$)(\d+[a-f]|[a-f]+\d)/i;
  if (val.length !== 0) {
    if (checkFormat.test(val)) {
      return true;
    }
    return false;
  }
  return false;
};
export const toCapitalized = myString => {
  return myString
    .trim()
    .toLowerCase()
    .replace(/\w\S*/g, w => w.replace(/^\w/, c => c.toUpperCase()));
};
export const config = {
  interpolation: 'spline',
  area: {
    gradientFrom: '#10ac84',
    gradientFromOpacity: 1,
    gradientTo: '#10ac84',
    gradientToOpacity: 0.4,
  },
  line: {
    visible: false,
  },
};
export const WeeklyLabel = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
];
export const monthNames = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];
export const handleInformation = item => {
  if (item.cashier) {
    return {
      name: toCapitalized(
        item.cashier.lastname +
          ', ' +
          item.cashier.firstname +
          ' ' +
          item.cashier.middlename,
      ),
      url: item.cashier.profile.url,
      type: 'Cashier',
    };
  }
  if (item.branch) {
    return {
      name: toCapitalized(
        item.branch.branch_owner_lname +
          ', ' +
          item.branch.branch_owner_fname +
          ' ' +
          item.branch.branch_owner_MI,
      ),
      url: item.branch.branch_owner_profile.profile,
      type: 'owner',
    };
  }
};
