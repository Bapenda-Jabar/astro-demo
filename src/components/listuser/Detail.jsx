import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Sidebar } from 'primereact/sidebar';
import { Button } from 'primereact/button';

const Detail = ({ detailData, isVisible, setVisible }) => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const [password, setPassword] = useState('smadlalsdnanlansdn');
  const [showPassword, setShowPassword] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [isSave, setIsSave] = useState('ubah');

  const [showForm, setShowForm] = useState(false);

  const save = () => {
    setIsSave('simpan');

    setIsEdit(false);
  };

  function handleChange(event) {
    setSelectedDate(event.target.value);
  }
  const handleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const onSubmit = (data) => {
    console.log('on submit');
    console.log(data);
  };

  const handleCheckboxChange = (event) => {
    setShowForm(event.target.checked);
  };

  return (
    <>
      <Sidebar visible={isVisible} position="right" onHide={() => setVisible(false)}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="p-2 m-2">
            <h3 className="fw-semibold">Detail User</h3>
          </div>

          <div className="mb-3">
            <div className="p-2">
              <label htmlFor="user_name">Username</label>
              <input {...register('user_name')} type="text" id="user_name" className="form-control" defaultValue={detailData?.user_name} disabled={isEdit ? false : true} />
            </div>
            <div className="p-2">
              <label htmlFor="email">Email</label>
              <input {...register('email')} type="email" id="email" className="form-control" defaultValue={detailData?.email} disabled={isEdit ? false : true} />
            </div>
            <div className="p-2">
              <label htmlFor="user_password">Password</label>
              <div className="form-text">Minimal 8 karakter yang terdiri dari huruf besar, huruf kecil dan angka.</div>
              <div className="input-group mt-2">
                <input type={showPassword ? 'text' : 'password'} className="form-control" value={password} onChange={(e) => setPassword(e.target.value)} aria-label="Username" aria-describedby="basic-addon1" />
                <span className="input-group-text" style={{ right: '11px', top: '11px' }} onClick={handleShowPassword} id="basic-addon1">
                  {showPassword ? <i className="fa-sharp fa-solid fa-eye-slash"></i> : <i className="fa-solid fa-eye"></i>}
                </span>
              </div>
            </div>
            <div className="p-2">
              <label htmlFor="nama">Nama</label>
              <input type="text" className="form-control" id="nama" value={detailData?.nama} disabled={!isEdit} />
            </div>
            <div className="p-2">
              <label htmlFor="role">Role</label>
              <input type="text" className="form-control" id="role" value={detailData?.role} disabled />
            </div>
            <div className="p-2">
              <label htmlFor="status">Status</label>
              <input {...register('status')} type="text" className="form-control" id="status" value={detailData?.status} disabled={isEdit ? false : true} />
            </div>
          </div>

          <div className="mb-3 form-check">
            <input className="form-check-input" type="checkbox" checked={showForm} onChange={handleCheckboxChange} />
            <label className="form-check-label">{''}Pegawai Pemprov Jawa Barat</label>
          </div>

          {showForm && (
            <>
              <div className="mb-3">
                <label htmlFor="nip">NIP</label>
                <input name="nip" className="form-control" type="text" placeholder="Contoh: 10101060" defaultValue="10101060" />
              </div>

              <div className="mb-3">
                <label htmlFor="jabatan">Jabatan</label>
                <select className="form-control" name="jabatan" disabled>
                  <option value="">Pilih salah satu</option>
                  <option value="jabatan1">jabatan 1</option>
                  <option value="jabatan2">jabatan 2</option>
                </select>
              </div>

              <div className="mb-3">
                <label htmlFor="unitkerja">Unit Kerja / OPD</label>
                <select className="form-control" name="unitkerja" disabled>
                  <option value="">Pilih salah satu</option>
                  <option value="unitkerja1">unitkerja 1</option>
                  <option value="unitkerja2">unitkerja 2</option>
                </select>
              </div>
            </>
          )}

          <div className="mb-3 d-grid gap-2">
            {isEdit ? <Button type="submit" label="Simpan" /> : <Button label="Ubah" onClick={() => setIsEdit(true)} />}
            <button
              onClick={() => {
                setIsEdit(false);
                setVisible(false);
              }}
              type="button"
              className="btn btn-outline-primary"
            >
              Batal
            </button>
          </div>
        </form>
      </Sidebar>
    </>
  );
};

export default Detail;
