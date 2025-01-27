<template>
  <div>
    <canvas id="barChart"></canvas>
  </div>
</template>

<script>
import { ref, onMounted } from "vue";
import Chart from "chart.js/auto";

export default {
  name: "BarChart",
  props: {
    labels: {
      type: Array,
      required: true,
    },
    data: {
      type: Array,
      required: true,
    },
  },
  setup(props) {
    const chart = ref(null);

    onMounted(() => {
      // Tạo biểu đồ khi component được mount
      const ctx = document.getElementById("barChart").getContext("2d");

      chart.value = new Chart(ctx, {
        type: "bar",
        data: {
          labels: props.labels,
          datasets: [
            {
              label: "Revenue",
              data: props.data,
              backgroundColor: "rgba(75, 192, 192, 0.6)",
              borderColor: "rgba(75, 192, 192, 1)",
              borderWidth: 1,
            },
          ],
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              position: "top",
            },
          },
          scales: {
            y: {
              beginAtZero: true,
            },
          },
        },
      });
    });

    return { chart };
  },
};
</script>
