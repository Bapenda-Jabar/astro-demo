import React, { useEffect } from "react";
import { signal } from "@preact/signals-react";
import { fetchClient } from "../utils/axios";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { Paginator } from "primereact/paginator";
import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";
import { Dialog } from "primereact/dialog";

import Tambah from "./listuser/Tambah";
import FormL from "./listuser/FormL";
import { Toolbar } from "primereact/toolbar";
import Edit from "./listuser/Edit";
import "../../src/assets/css/test.css";
// TODO : Next task
import Detail from "./listuser/Detail";

// css primeReact
import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";

const error = signal(null);
const data = signal([]);
const loading = signal(true);
const globalFilter = signal("");
const kolom = signal("");

const visibleRight1 = signal(null);
const editData = signal(null);
const detailData = signal(null);
const visibleRight3 = signal(null);

// TODO : next task
const visibleRight2 = signal(null);

const editDialog = signal(false);
const selectedData = signal(null);
const deleteDialog = signal(false);
const first = signal(0);
const rows = signal(10);
const page = signal(1);
const totalRecords = signal(0);

const searchInput = signal("");

const showForm = signal(false);

export default function ListUser() {
  const fetchData = async () => {
    try {
      loading.value = true;
      const response = await fetchClient().get(
        `/api/user/list?page=${page.value}&per-page=${rows.value}&keyword=${globalFilter.value}&kolom=${kolom.value}`
      );
      data.value = response.data.data_user.data;
      totalRecords.value = response.data.data_user.total;
      loading.value = false;
    } catch (err) {
      error.value = err;
      loading.value = false;
    }
  };

  // TODO : Lanjutkan untuk pencarian
  const onSearch = async (event) => {
    globalFilter.value = event.target.value;
    // let delayres = await delay(1500);
    const searchParams = new URLSearchParams(window.location.search);
    searchParams.set("keyword", globalFilter.value);
    window.history.pushState(null, "", `?${searchParams.toString()}`);
    fetchData(globalFilter.value);
  };

  const handleSearchByChange = (event) => {
    kolom.value = event.target.value;
    // let delayres = await delay(1500);
    const searchParams = new URLSearchParams(window.location.search);
    searchParams.set("kolom", kolom.value);
    window.history.pushState(null, "", `?${searchParams.toString()}`);
    fetchData(kolom.value);
  };

  const handleClear = () => {
    const searchParams = new URLSearchParams(window.location.search);
    globalFilter.value = "";
    kolom.value = "";

    // Mengubah query parameter di URL menggunakan fungsi pushState
    if (globalFilter.value) {
      searchParams.delete("keyword");
    } else {
      searchParams.set("keyword", globalFilter.value);
    }
    if (kolom.value) {
      searchParams.delete("kolom");
    } else {
      searchParams.set("kolom", kolom.value);
    }
    window.history.pushState(null, "", `?${searchParams.toString()}`);
    fetchData(globalFilter.value, kolom.value);
  };

  // TODO : Lanjutkan tambah User
  const rightToolbarTemplate = () => {
    return (
      <div className="flex flex-wrap gap-2">
        <Button
          label="Tambah"
          icon="pi pi-plus"
          onClick={() => {
            visibleRight1.value = true;
          }}
          severity="info"
          size="small"
        />
      </div>
    );
  };

  // TODO : Lanjutkan tambah User
  const leftToolbarTemplate = () => {
    return (
      <div className="flex justify-content-start">
        <span className="p-input-icon-left">
          <i className="pi pi-search" />
          <InputText
            value={globalFilter.value}
            onChange={onSearch}
            placeholder="Cari User"
          />
          {searchInput && (
            <Button
              type="button"
              icon="pi pi-times"
              onClick={handleClear}
              severity="help"
              aria-label="Cancel"
            />
          )}
          {/* <InputText type="text" value={searchInput} onChange={handleInputChange} placeholder="Search" />
          {searchInput && <Button type="button" icon="pi pi-times" className="p-button-secondary" onClick={handleClear} />} */}
          &nbsp;&nbsp;
          <Dropdown
            placeholder="Semua"
            value={kolom.value}
            options={searchOptions}
            onChange={handleSearchByChange}
          />
        </span>
      </div>
    );
  };

  const searchOptions = [
    { label: "Username", value: "user_name" },
    { label: "Email", value: "email" },
    { label: "Nama", value: "nama" },
    { label: "Role", value: "nama_role" },
  ];

  const statusInfo = {
    1: {
      className: "btn btn-outline-success rounded-3 btn-sm",
      label: "Aktif",
    },
    0: {
      className: "btn btn-outline-danger rounded-3 btn-sm",
      label: "Tidak Aktif",
    },
  };

  const statusBodyTemplate = (data) => {
    const status = statusInfo[data.status];
    return (
      <>
        <button type="button" className={status.className}>
          {status.label}
        </button>
      </>
    );
  };

  const onPageChange = (event) => {
    page.value = event.page + 1;
    first.value = event.first;
    rows.value = event.rows;

    const searchParams = new URLSearchParams(window.location.search);
    searchParams.set("page", page.value);
    searchParams.set("per-page", rows.value);
    window.history.pushState(null, "", `?${searchParams.toString()}`);
    fetchData(rows.value, page.value);
  };

  // TODO : next task
  const onDeleteDialogHide = () => {
    deleteDialog.value = false;
  };

  // TODO : next task
  const onDeleteData = () => {
    fetchClient()
      .delete(`/api/user/delete/`, { data: { id: selectedData.value.id } })
      .then(() => {
        fetchData();
        selectedData.value = null;
        deleteDialog.value = false;
      })
      .catch((err) => {
        error.value = err;
        // TODO : tambahkan kode untuk menampilkan pesan gagal dihapus
      });
  };

  // TODO : Edit user
  const onEditDialogHide = () => {
    editDialog.value = false;
  };

  // TODO : Next task
  const aksiDropdown = (data) => {
    return (
      <>
        <div className="dropdown">
          <button
            className="btn btn-outline-primary dropdown-toggle"
            type="button"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            Aksi
          </button>
          <ul className="dropdown-menu">
            <li>
              <a
                type="button"
                className="dropdown-item"
                // TODO : Next task
                onClick={() => {
                  detailData.value = data;
                  visibleRight2.value = true;
                }}
              >
                <i className="fa-solid fa-eye"></i>
                &nbsp;Detail
              </a>
            </li>
            <li>
              <a
                type="button"
                className="dropdown-item"
                // TODO : Next task
                onClick={() => {
                  editData.value = data;
                  editDialog.value = true;
                }}
              >
                <i className="fa-solid fa-pencil"></i>
                &nbsp; Ubah
              </a>
            </li>
            <li>
              <a
                type="button"
                className="dropdown-item"
                // TODO : Next task
                onClick={() => {
                  selectedData.value = data;
                  deleteDialog.value = true;
                }}
              >
                <i className="fa-solid fa-trash"></i>
                &nbsp;Hapus
              </a>
            </li>
          </ul>
        </div>
      </>
    );
  };

  const handleCheckboxChange = (event) => {
    showForm.value = event.target.checked;
  };

  useEffect(() => {
    fetchData();

    // Mendapatkan query parameter dari URL saat komponen dimuat
    const searchParams = new URLSearchParams(window.location.search);
    globalFilter.value = searchParams.get("keyword") || "";
    page.value = parseInt(searchParams.get("page") || 1);
    rows.value = parseInt(searchParams.get("per-page") || 10);
    kolom.value = searchParams.get("kolom") || "";

    // Mengubah query parameter di URL menggunakan fungsi pushState
    if ((globalFilter.value, kolom.value)) {
      searchParams.set("keyword", globalFilter.value);
      searchParams.set("kolom", kolom.value);
    } else {
      searchParams.delete("keyword");
      searchParams.delete("kolom");
    }

    // Mengubah query parameter di URL menggunakan fungsi pushState\
    searchParams.set("page", page.value);
    searchParams.set("per-page", rows.value);
    window.history.pushState(null, "", `?${searchParams.toString()}`);
  }, []);

  return (
    <>
      <div className="container">
        <div className="card mt-5 mb-5 shadow">
          <div className="card-body">
            {error.value && <div>{error.value.message}</div>}
            <Toolbar
              className="mb-4"
              left={leftToolbarTemplate}
              right={rightToolbarTemplate}
            ></Toolbar>
            <div className="table-responsive">
              <DataTable
                value={data.value}
                showGridlines
                stripedRows
                loading={loading.value}
                dataKey="id"
                globalFilterFields={["user_name", "email", "status"]}
                emptyMessage="Belum ada data"
                className="p-datatable-sm"
              >
                <Column
                  field="user_name"
                  header="Username"
                  bodyClassName="text-center"
                />
                <Column
                  field="email"
                  header="Email"
                  bodyClassName="text-center"
                />
                <Column
                  field="nama"
                  header="Nama"
                  bodyClassName="text-center"
                />
                <Column
                  field="nama_role"
                  header="Role"
                  bodyClassName="text-center"
                />
                <Column
                  field="status"
                  header="Status"
                  body={statusBodyTemplate}
                  bodyClassName="text-center"
                />
                <Column
                  field="last_login_date"
                  header="Login Terakhir"
                  bodyClassName="text-center"
                />
                <Column
                  field="Aksi"
                  header="Aksi"
                  body={aksiDropdown}
                  bodyClassName="text-center"
                ></Column>
              </DataTable>
              <Paginator
                first={first.value}
                rows={rows.value}
                totalRecords={totalRecords.value}
                onPageChange={onPageChange}
                rowsPerPageOptions={[10, 20, 30, 40, 50]}
                template="RowsPerPageDropdown FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
                className="justify-content-end"
              />

              {/* // TODO : Next task */}
              {/* <Dialog
                visible={deleteDialog.value}
                onHide={onDeleteDialogHide}
                header="Konfirmasi Hapus Data"
                modal
                footer={
                  <div>
                    <Button label="Batal" icon="pi pi-times" className="p-button-text" onClick={onDeleteDialogHide} />
                    <Button label="Ya, Hapus Sekarang" icon="pi pi-check" className="p-button-danger" onClick={onDeleteData} />
                  </div>
                }
              >
                Apakah Anda yakin ingin <b>Menghapus data tersebut?</b>
              </Dialog> */}

              {/* TODO: Lanjutkan Edit User  */}
              <Dialog
                visible={editDialog.value}
                onHide={onEditDialogHide}
                header="Edit data"
                modal
                footer={
                  <div>
                    <Button
                      label="Batal"
                      icon="pi pi-times"
                      className="p-button-text"
                      onClick={onEditDialogHide}
                    />
                  </div>
                }
              >
                <div className="mt-3 mb-3">
                  <label htmlFor="user_name">Username</label>
                  <input
                    type="text"
                    className="form-control"
                    name="user_name"
                    defaultValue={editData.value?.user_name}
                    placeholder="Contoh: dian.anita"
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="email">Email</label>
                  <input
                    type="email"
                    className="form-control"
                    name="email"
                    defaultValue={editData.value?.email}
                    placeholder="Contoh: dian.anita@gmail.com"
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="user_password">Password</label>
                  <div className="form-text">
                    Minimal 8 karakter yang terdiri dari huruf besar, huruf
                    kecil dan angka.
                  </div>
                  <div className="input-group mt-2">
                    <input
                      type="password"
                      className="form-control"
                      placeholder="******"
                    />
                  </div>
                </div>
                <div className="mb-3">
                  <label htmlFor="nama">Nama</label>
                  <input
                    type="text"
                    className="form-control"
                    name="nama"
                    defaultValue={editData.value?.nama}
                    placeholder="Contoh: Dian Anita"
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="nama_role">Role</label>
                  <input
                    type="text"
                    className="form-control"
                    name="nama_role"
                    defaultValue={editData.value?.nama_role}
                    placeholder="Contoh: Dian Anita"
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="status">Status</label>
                  <select
                    className="form-control"
                    name="status"
                    defaultValue={editData.value?.status}
                  >
                    <option value="0">Tidak Aktif</option>
                    <option value="1">Aktif</option>
                  </select>
                </div>

                <div className="mb-3 form-check">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    checked={showForm.value}
                    onChange={handleCheckboxChange}
                  />
                  <label className="form-check-label">
                    {""}Pegawai Pemprov Jawa Barat
                  </label>
                </div>

                {showForm.value && (
                  <>
                    <div className="mb-3">
                      <label htmlFor="nip">NIP</label>
                      <input
                        type="text"
                        name="nip"
                        className="form-control"
                        defaultValue={editData.value?.nip}
                        placeholder="Contoh: Dian Anita"
                      />
                    </div>
                    <div className="mb-3">
                      <label htmlFor="nama_jabatan">Jabatan</label>
                      <input
                        type="text"
                        name="nama_jabatan"
                        className="form-control"
                        defaultValue={editData.value?.nama_jabatan}
                        placeholder="Pilih salah satu"
                        disabled
                      />
                    </div>
                    <div className="mb-3">
                      <label htmlFor="nama_opd">Unit Kerja / OPD</label>
                      <input
                        type="text"
                        className="form-control"
                        name="nama_opd"
                        defaultValue={editData.value?.nama_opd}
                        placeholder="Pilih salah satu"
                        disabled
                      />
                    </div>
                  </>
                )}
              </Dialog>

              {/* // TODO : Next task */}
              <div className="card-body mt-3 mb-3">
                <FormL
                  isVisible={visibleRight1.value}
                  setVisible={visibleRight1.value}
                />
                <Edit
                  detailData={detailData.value}
                  isVisible={visibleRight3.value}
                  setVisible={visibleRight3.value}
                />
                <Detail
                  detailData={detailData.value}
                  isVisible={visibleRight2.value}
                  setVisible={visibleRight2.value}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
