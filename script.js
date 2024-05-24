document.addEventListener("DOMContentLoaded", () => {
    fetchDataWithThen();
});
coinsData = [];
function fetchDataWithThen() {
  fetch(
    "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1&sparkline=false"
  )
    .then((response) => response.json())
    .then((data) => {
      coinsData = data;
      renderTable(data);
    })
    .catch((err) => console.log("Error fetching data:", err));
}

async function fetchDataWithAsyncAwait() {
  try {
    const response = await fetch(
      "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1&sparkline=false"
    );
    const data = await response.json();
    coinsData = data;
    //console.log(data);
    renderTable(data);
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

function renderTable(data) {
  const tbody = document.querySelector("#data-table tbody");
  tbody.innerHTML = ""; // Clear existing rows
  //console.log(data);
  data.forEach((coin) => {
    const changeClass =
      coin.market_cap_change_percentage_24h >= 0 ? "positive" : "negative";
    const row = document.createElement("tr");
    row.innerHTML = `
            <td class="coin-cell">
            <img src="${coin.image}" alt="${coin.id}" width="20">
            ${coin.name}
            </td>
            <td>${coin.symbol.toUpperCase()}</td>
            <td>$${coin.current_price.toLocaleString()}</td>
            <td>$${coin.total_volume.toLocaleString()}</td>
            <td class="${changeClass}">$${coin.market_cap_change_percentage_24h.toLocaleString()}</td>
            <td>Mkt Cap:$${coin.market_cap.toLocaleString()}</td>
        `;
    tbody.appendChild(row);
  });
}

document.getElementById("search-input").addEventListener("input", function () {
  const searchQuery = this.value.toLowerCase();
  const filteredData = coinsData.filter(
    (coin) =>
      coin.name.toLowerCase().includes(searchQuery) ||
      coin.symbol.toLowerCase().includes(searchQuery)||
      coin.current_price.toString().toLowerCase().includes(searchQuery)||
      coin.total_volume.toString().toLowerCase().includes(searchQuery)||
      coin.market_cap.toString().toLowerCase().includes(searchQuery)
  );
  renderTable(filteredData);
});

document
  .getElementById("sort-market-cap")
  .addEventListener("click", function () {
    //console.log("short");
    const sortedData = [...coinsData].sort(
      (a, b) => b.market_cap - a.market_cap
    );
    renderTable(sortedData);
  });

document
  .getElementById("sort-percentage-change")
  .addEventListener("click", function () {
    const sortedData = [...coinsData].sort(
      (a, b) =>
        b.market_cap_change_percentage_24h - a.market_cap_change_percentage_24h
    );
    renderTable(sortedData);
  });
