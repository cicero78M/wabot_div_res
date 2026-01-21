const runReportQuery = async ({ db, sql }) => {
  const { rows } = await db.query(sql);
  return rows;
};

export const fetchTaskDeliveryRecap = ({ db }) => {
  return runReportQuery({
    db,
    sql: `SELECT recipient, summary
          FROM task_delivery_recap_view
          WHERE delivered_at >= NOW() - INTERVAL '1 day'`
  });
};

export const fetchDailyReport = ({ db }) => {
  return runReportQuery({
    db,
    sql: `SELECT recipient, summary
          FROM daily_report_view
          WHERE report_date = CURRENT_DATE - INTERVAL '1 day'`
  });
};

export const fetchWeeklyReport = ({ db }) => {
  return runReportQuery({
    db,
    sql: `SELECT recipient, summary
          FROM weekly_report_view
          WHERE week_start = DATE_TRUNC('week', CURRENT_DATE - INTERVAL '1 week')`
  });
};

export const fetchMonthlyReport = ({ db }) => {
  return runReportQuery({
    db,
    sql: `SELECT recipient, summary
          FROM monthly_report_view
          WHERE month_start = DATE_TRUNC('month', CURRENT_DATE - INTERVAL '1 month')`
  });
};
