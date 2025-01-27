<template>
  <div>
    <canvas id="pieChart"></canvas>
  </div>
</template>

<script>
import { ref, onMounted } from "vue";
import Chart from "chart.js/auto";

export default {
  name: "PieChart",
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
      const ctx = document.getElementById("pieChart").getContext("2d");

      chart.value = new Chart(ctx, {
        type: "doughnut",
        data: {
          labels: props.labels,
          datasets: [
            {
              data: props.data,
              backgroundColor: [
                "#E57373",
                "#64B5F6",
                "#81C784",
                "#FFD54F",
                "#4FC3F7",
                "#4DD0E1",
                "#FF8A65",
                "#90A4AE",
                "#F06292",
                "#7986CB",
                "#AED581",
                "#BA68C8",
                "#FFB74D",
                "#9575CD",
                "#DCE775",
                "#A1887F",
              ],
              hoverOffset: 4,
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
        },
      });
    });

    return { chart };
  },
};
</script>
