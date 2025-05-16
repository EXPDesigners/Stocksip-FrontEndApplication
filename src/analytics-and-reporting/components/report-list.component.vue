<script>
import ReportItem from "@/analytics-and-reporting/components/report-item.component.vue";

export default {
  name: "report-list",
  props: {
    reports: Array
  },
  components: {
    ReportItem
  },
  emits: ['edit', 'delete']
}
</script>

<template>
  <table class="report-table">
    <thead>
    <tr>
      <th>Name</th>
      <th>Type</th>
      <th>Unit Price</th>
      <th>Quantity</th>
      <th>Date</th>
      <th>Actions</th>
    </tr>
    </thead>
    <tbody>
    <report-item
        v-for="(report, index) in reports"
        :key="index"
        :report="report"
        :index="index"
        @edit="$emit('edit', index)"
        @delete="$emit('delete', index)"
    />
    </tbody>
  </table>
</template>

<style scoped>
.report-table {
  width: 100%;
  margin-top: 1.5rem;
  background: white;
  border-radius: 12px;
  overflow: hidden;
  border-collapse: collapse;
}
.report-table th,
.report-table td {
  padding: 0.9rem 1rem;
  border-bottom: 1px solid #eee;
  vertical-align: middle;
}

.report-table th {
  text-align: left;
  font-weight: bold;
  color: #333;
}

.report-table td:nth-child(3),
.report-table td:nth-child(4),
.report-table td:nth-child(6) {
  text-align: center;
}

.report-table td:nth-child(5) {
  white-space: nowrap;
}

.report-table td {
  font-size: 0.95rem;
  color: #444;
}

</style>