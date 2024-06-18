import { useFormik } from 'formik';
import * as yup from 'yup';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';

const validationSchema = yup.object({
  email: yup
    .string()
    .email('Enter a valid email')
    .required('Email is required'),
  password: yup
    .string()
    .min(8, 'Password should be of minimum 8 characters length')
    .max(32, 'Password should be of maximum 32 characters length')
    .required('Password is required'),
  confirm: yup
    .string()
    .oneOf([yup.ref('password'), ""], 'Passwords must match')
    .required('Confirm Password is correct')
});

export default function RegisterForm() {
  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
      confirm: '',
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      // TODO: Handle form submission
      alert(JSON.stringify(values, null, 2))
    },
  })

  return (
    <div>
      <form onSubmit={formik.handleSubmit}>
        <TextField
          fullWidth
          id="email"
          name="email"
          label="Email"
          size="small"
          value={formik.values.email}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.email && Boolean(formik.errors.email)}
          helperText={formik.touched.email && formik.errors.email ? formik.errors.email : ' '}
        />
        <TextField
          fullWidth
          id="password"
          name="password"
          label="Password"
          type="password"
          size="small"
          value={formik.values.password}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.password && Boolean(formik.errors.password)}
          helperText={formik.touched.password && formik.errors.password ? formik.errors.password : ' '}
        />
        <TextField
          fullWidth
          id="confirm"
          name="confirm"
          label="Confirm Password"
          type="password"
          size="small"
          value={formik.values.confirm}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.confirm && Boolean(formik.errors.confirm)}
          helperText={formik.touched.confirm && formik.errors.confirm ? formik.errors.confirm : ' '}
        />
        <Button
          color="primary"
          variant="contained"
          fullWidth
          type="submit"
          disabled={!formik.isValid}
        >
          Sign Up!
        </Button>
      </form>
    </div>
  )
}