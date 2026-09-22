# UK Online Retail Executive Dashboard

## Project overview

This Power BI project turns transactional retail data into an executive dashboard for monitoring sales performance, customer activity, order behavior, returns, and customer value.

The goal was to practice the complete business intelligence workflow: understand a business question, clean raw data, define useful metrics, build a clear dashboard, and communicate what decision-makers should examine next.

## Business problem

Retail transaction data can contain cancelled invoices, returned items, missing customer records, inconsistent text fields, and negative quantities. Without careful preparation, these issues can distort performance reporting.

The dashboard was designed to help answer:

- How is sales performance changing over time?
- How many customers are actively purchasing?
- What is the average value of an order?
- Which customers contribute the most value?
- How do sales and returns affect the overall picture?

## Tools

- Power BI
- Power Query
- DAX
- Microsoft Excel

## Data preparation

The transformation process included:

1. Trimming and cleaning text fields.
2. Checking column quality and removing empty or error values where appropriate.
3. Reviewing negative quantities and cancelled invoices instead of treating them as normal sales.
4. Creating a `SalesType` field to classify each row as a sale or return.
5. Preparing the data model for reusable KPI measures and visual analysis.

The `SalesType` logic identifies a return when the invoice number begins with `C` or when quantity is negative. All other records are classified as sales.

## Dashboard design

The executive page brings the most important metrics together:

- Total Revenue
- Total Orders
- Active Customers
- Average Order Value
- Monthly Sales Performance
- Top 10 Customers
- Customer Value

The visual hierarchy is intentionally simple. KPI cards provide a quick performance summary, while the charts help explain trends and customer concentration.

## Outcome

The project demonstrates my ability to:

- Prepare imperfect transactional data for analysis.
- Separate sales and return behavior.
- Translate business questions into KPI measures.
- Design an executive dashboard with a clear reading order.
- Present findings in a format suitable for business stakeholders.

## Next steps

- Complete a dedicated returns analysis page.
- Add product and country drill-through views.
- Document the final DAX measures.
- Publish the finished `.pbix` file and dashboard screenshots in a dedicated project repository.
