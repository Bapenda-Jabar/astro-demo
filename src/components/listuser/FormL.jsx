import React, { useState, useEffect } from 'react';
import { signal } from '@preact/signals-react';
import { fetchClient } from '../../utils/axios';
import { Sidebar } from 'primereact/sidebar';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import Select from 'react-select';

const FormL = ({ isVisible, setVisible }) => {
  const showForm = signal(false);
  const [roles, setRoles] = useState([]);
  const [jabatan, setJabatan] = useState([]);
  const [opd, setOpd] = useState([]);

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const response = await fetchClient().get('/api/role/list');
        setRoles(response.data.data_user.data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchRoles();
  }, []);

  useEffect(() => {
    const fetchJabatan = async () => {
      try {
        const response = await fetchClient().get('/api/jabatan/list');
        setJabatan(response.data.data_opd.data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchJabatan();
  }, []);

  useEffect(() => {
    const fetchOpd = async () => {
      try {
        const response = await fetchClient().get('/api/opd/list');
        setOpd(response.data.data_opd.data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchOpd();
  }, []);

  const statusAkun = [
    { value: '1', label: 'Aktif' },
    { value: '0', label: 'Tidak Aktif' },
  ];

  const handleCheckboxChange = (event) => {
    showForm.value = event.target.checked;
  };

  const SignupSchema = Yup.object().shape({
    user_name: Yup.string().min(3, 'Username terlalu pendek!').max(15, 'Username terlalu panjang!').required('Username harus diisi!'),
    email: Yup.string().email('Email tidak valid!').required('Email harus diisi!'),
    user_password: Yup.string().min(6, 'Password terlalu pendek!').max(20, 'Password terlalu panjang!').required('Password harus diisi!'),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('user_password'), null], 'Passwords must match')
      .required('Confirm Password is required'),
    nama: Yup.string().required('Pilihan harus dipilih'),
    role_id: Yup.string().required('Pilihan harus dipilih'),
    status: Yup.string().required('Pilihan harus dipilih'),
    nip: Yup.string().required('Pilihan harus dipilih'),
    jabatan_id: Yup.string().required('Pilihan harus dipilih'),
    unit_id: Yup.string().required('Pilihan harus dipilih'),
  });

  return (
    <>
      <Sidebar visible={isVisible} position="right" onHide={() => setVisible(false)}>
        {/* <form>
          <div className="p-2 m-2">
            <h3 className="fw-semibold">Tambah User</h3>
          </div>

          <div className="mb-3">
            <div className="p-2">
              <label htmlFor="user_name">Username</label>
              <input {...register('user_name')} type="text" id="user_name" className="form-control" required />
            </div>
            <div className="p-2">
              <label htmlFor="email">Email</label>
              <input {...register('email')} type="email" id="email" className="form-control" required />
            </div>
            <div className="p-2">
              <label htmlFor="user_password">Password</label>
              <div className="form-text">Minimal 8 karakter yang terdiri dari huruf besar, huruf kecil dan angka.</div>
              <div className="input-group mt-2">
                <Field {...register('user_password')} type={showPassword ? 'text' : 'password'} className="form-control" value={password} onChange={(e) => setPassword(e.target.value)} aria-label="Username" aria-describedby="basic-addon1" required />
                <span className="input-group-text" style={{ right: '11px', top: '11px' }} onClick={handleShowPassword} id="basic-addon1">
                  {showPassword ? <i className="fa-sharp fa-solid fa-eye-slash"></i> : <i className="fa-solid fa-eye"></i>}
                </span>
              </div>
            </div>
            <div className="p-2">
              <label htmlFor="nama">Nama</label>
              <input type="text" className="form-control" id="nama" disabled />
            </div>
            <div className="p-2">
              <label htmlFor="role">Role</label>
              <input type="text" className="form-control" id="role" disabled />
            </div>
            <div className="p-2">
              <label htmlFor="status">Status</label>
              <input type="text" className="form-control" id="status" />
            </div>
          </div>
          <div className="mb-3 form-check">
            <input className="form-check-input" type="checkbox" />
            <label className="form-check-label">{''}Pegawai Pemprov Jawa Barat</label>
          </div>
          <div className="mb-3 d-grid gap-2">
            <button className="btn btn-primary" type="Submit">
              Simpan
            </button>
            <button
              onClick={() => {
                setVisible(false);
              }}
              type="button"
              className="btn btn-outline-primary"
            >
              Batal
            </button>
          </div>
        </form> */}
        <Formik
          initialValues={{
            user_name: '',
            email: '',
            user_password: '',
            confirmPassword: '',
            nama: '',
            role_id: '',
            status: '',
            nip: '',
            jabatan_id: '',
            unit_id: '',
          }}
          validationSchema={SignupSchema}
          onSubmit={(values, { setSubmitting }) => {
            fetchClient()
              .post('/api/user/create', values)
              .then(() => {
                // setVisible(false);
                alert('Registrasi berhasil!');
              })
              .catch((error) => {
                console.log(error);
              })
              .finally(() => {
                setSubmitting(false);
              });
            // alert(JSON.stringify(values));
          }}
        >
          {({ errors, touched, isSubmitting }) => (
            <Form>
              <div className="p-2 m-2">
                <h4 className="fw-semibold">Tambah User</h4>
              </div>
              <div className="mb-3">
                <label htmlFor="user_name">Username</label>
                <Field type="text" className={'form-control' + (errors.user_name && touched.user_name ? ' is-invalid' : '')} name="user_name" placeholder="Contoh: dian.anita" />
                <ErrorMessage name="user_name" component="div" className="invalid-feedback" />
              </div>

              <div className="mb-3">
                <label htmlFor="email">Email</label>
                <Field type="email" className={'form-control' + (errors.email && touched.email ? ' is-invalid' : '')} name="email" placeholder="Contoh: dian.anita@gmail.com" />
                <ErrorMessage name="email" component="div" className="invalid-feedback" />
              </div>

              <div className="mb-3">
                <label htmlFor="user_password">Password</label>
                <div className="form-text">Minimal 8 karakter yang terdiri dari huruf besar, huruf kecil dan angka.</div>
                <Field name="user_password" className={'form-control' + (errors.user_password && touched.user_password ? ' is-invalid' : '')} type="password" placeholder="******" />
                <ErrorMessage name="user_password" component="div" className="invalid-feedback" />
              </div>

              <div className="mb-3">
                <label htmlFor="confirmPassword">Konfirmasi Password</label>
                <Field name="confirmPassword" className={'form-control' + (errors.confirmPassword && touched.confirmPassword ? ' is-invalid' : '')} type="password" placeholder="******" />
                <ErrorMessage name="confirmPassword" component="div" className="invalid-feedback" />
              </div>

              <div className="mb-3">
                <label htmlFor="nama">Nama</label>
                <Field name="nama" className={'form-control' + (errors.nama && touched.nama ? ' is-invalid' : '')} type="text" placeholder="Contoh: Dian Anita" />
                <ErrorMessage name="nama" component="div" className="invalid-feedback" />
              </div>

              <div className="mb-3">
                <label htmlFor="role_id">Role</label>
                <Field className={'form-control' + (errors.role_id && touched.role_id ? ' is-invalid' : '')} name="role_id" as="select">
                  <option value="">Pilih salah satu</option>
                  {roles.map((role) => (
                    <option key={role.id} value={role.id}>
                      {role.name}
                    </option>
                  ))}
                </Field>
                <ErrorMessage name="role_id" component="div" className="invalid-feedback" />
              </div>

              <div className="mb-3">
                <label htmlFor="status">Status</label>
                <Field className={'form-control' + (errors.status && touched.status ? ' is-invalid' : '')} name="status" as="select">
                  <option value="">Pilih salah satu</option>
                  {statusAkun.map((status) => (
                    <option key={status.value} value={status.value}>
                      {status.label}
                    </option>
                  ))}
                </Field>
                <ErrorMessage name="role" component="div" className="invalid-feedback" />
              </div>

              <div className="mb-3 form-check">
                <input className="form-check-input" type="checkbox" checked={showForm.value} onChange={handleCheckboxChange} />
                <label className="form-check-label">{''}Pegawai Pemprov Jawa Barat</label>
              </div>

              {showForm.value && (
                <>
                  <div className="mb-3">
                    <label htmlFor="nip">NIP</label>
                    <Field name="nip" className={'form-control' + (errors.nip && touched.nip ? ' is-invalid' : '')} type="text" placeholder="Contoh: 10101060" />
                    <ErrorMessage name="nip" component="div" className="invalid-feedback" />
                  </div>

                  <div className="mb-3">
                    <label htmlFor="jabatan_id">Jabatan</label>
                    <Field className={'form-control' + (errors.jabatan_id && touched.jabatan_id ? ' is-invalid' : '')} name="jabatan_id" as="select">
                      <option value="">Pilih salah satu</option>
                      {jabatan.map((jabatan) => (
                        <option key={jabatan.id} value={jabatan.id}>
                          {jabatan.nama}
                        </option>
                      ))}
                    </Field>
                    <ErrorMessage name="jabatan_id" component="select" className="invalid-feedback" />
                  </div>

                  <div className="mb-3">
                    <label htmlFor="unit_id">Unit Kerja / OPD</label>
                    <Field className={'form-control' + (errors.unit_id && touched.unit_id ? ' is-invalid' : '')} name="unit_id" as="select">
                      <option value="">Pilih salah satu</option>
                      {opd.map((opd) => (
                        <option key={opd.id} value={opd.id}>
                          {opd.nama}
                        </option>
                      ))}
                    </Field>
                    <ErrorMessage name="unit_id" component="select" className="invalid-feedback" />
                  </div>
                </>
              )}

              <div className="mb-3 d-grid gap-2">
                <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                  Submit
                </button>
                <button
                  onClick={() => {
                    setVisible(false);
                  }}
                  type="button"
                  className="btn btn-outline-primary"
                >
                  Batal
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </Sidebar>
    </>
  );
};

export default FormL;
