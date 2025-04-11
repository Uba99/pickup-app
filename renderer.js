let editIndex = null;

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("pickupForm");
  const inputNama = document.getElementById("nama");
  const inputWaktu = document.getElementById("waktu");
  const inputDestination = document.getElementById("destination");
  const inputHarga = document.getElementById("harga");
  const inputKamar = document.getElementById("kamar");

  const filterNama = document.getElementById("filterNama");
  const filterTanggal = document.getElementById("filterTanggal");

  loadData();

  filterNama.addEventListener("input", loadData);
  filterTanggal.addEventListener("input", loadData);

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    try {
      const data = {
        nama: inputNama.value,
        waktu: inputWaktu.value,
        destination: inputDestination.value,
        harga: inputHarga.value,
        kamar: inputKamar.value,
      };

      if (editIndex !== null) {
        await window.electronAPI.editData(editIndex, data);
      } else {
        await window.electronAPI.simpanData(data);
      }

      form.reset();
      await loadData();
      editIndex = null;
    } catch (err) {
      console.error("Error saat submit:", err);
    }
  });
});

function filterData(data) {
  const namaFilter = document.getElementById("filterNama").value.toLowerCase();
  const tanggalFilter = document.getElementById("filterTanggal").value;

  return data.filter((item) => {
    const cocokNama = item.nama.toLowerCase().includes(namaFilter);
    const tanggalItem = item.waktu.split("T")[0]; // ambil YYYY-MM-DD
    const cocokTanggal = !tanggalFilter || tanggalItem === tanggalFilter;
    return cocokNama && cocokTanggal;
  });
}

async function loadData() {
  const semuaData = await window.electronAPI.ambilData(); // ambil semua data
  const dataTerfilter = filterData(semuaData); // filter sesuai input
  const output = document.getElementById("output");

  output.innerHTML = "";

  dataTerfilter.forEach((item, index) => {
    const div = document.createElement("div");
    div.innerHTML = `
      📌 Nama: ${item.nama} <br />
      📅 Waktu: ${new Date(item.waktu).toLocaleString()} <br />
      🎯 Tujuan: ${item.destination} <br />
      💵 Harga: Rp ${item.harga} <br />
      🛏️ Kamar: ${item.kamar} <br />
      <button class="edit-btn" data-index="${index}">✏️ Edit</button>
      <button class="hapus-btn" data-index="${index}">🗑️ Hapus</button>
      <hr />
    `;
    output.appendChild(div);
  });

  document.querySelectorAll(".hapus-btn").forEach((btn, i) => {
    btn.addEventListener("click", async () => {
      const indexAsli = semuaData.findIndex((d) =>
        d.nama === dataTerfilter[i].nama &&
        d.waktu === dataTerfilter[i].waktu
      );
      await window.electronAPI.hapusData(indexAsli);
      loadData();
    });
  });

  document.querySelectorAll(".edit-btn").forEach((btn, i) => {
    btn.addEventListener("click", () => {
      const item = dataTerfilter[i];
      const indexAsli = semuaData.findIndex((d) =>
        d.nama === item.nama && d.waktu === item.waktu
      );

      document.getElementById("nama").value = item.nama;
      document.getElementById("waktu").value = item.waktu;
      document.getElementById("destination").value = item.destination;
      document.getElementById("harga").value = item.harga;
      document.getElementById("kamar").value = item.kamar;

      editIndex = indexAsli;
    });
  });
}
