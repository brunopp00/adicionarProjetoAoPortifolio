import { useCallback, useEffect, useState } from 'react'
import './styles/global.css'
import { Field, Formik } from 'formik'
import { Button, Dialog, DialogContent, DialogTitle, Grid, Typography} from '@mui/material'
import { TextField } from 'formik-material-ui';
import * as Yup from 'yup';
import { Box } from '@mui/system';

function App() {
    const [listaProgramas, setListaProgramas] = useState([])
    const [isOpenModal, setIsOpenModal] = useState(false)
    const [dados, setDados] = useState([])
    
    const initialValues = {
        id: dados.id || undefined,
        title: dados.title || '',
        description: dados.description || '',
        urlScreen:  dados.urlScreen || '',
        urlRepo:dados.urlRepo || '',
        img:dados.img || '',
    }
    
    const FormSchema = Yup.object().shape({
        title: Yup.string().required('Title is required').min(4),
        description: Yup.string().min(10),
        urlScreen: Yup.string().url(),
        urlRepo: Yup.string().url(),
        img: Yup.string()
    })
    
    
    const salvarPrograms = (values, resetForm) => {
        fetch('http://localhost:3333/setProgram',{
            method:'POST',
            headers: { 'Content-Type': 'application/json'},
            body: JSON.stringify({
                id: values.id || undefined,
                title: values.title,
                description: values.description,
                urlScreen: values.urlScreen,
                urlRepo: values.urlRepo,
                img: values.img
            })
        }).then(res => res.json()).then((response) => {
        if(response.status) {
            resetForm()
            setDados([])
            getList()
            setIsOpenModal(false)
        }
    })
    }

    const excluiPrograma = (e, values) => {
        e.preventDefault()
        e.stopPropagation()
        fetch('http://localhost:3333/excluiPrograma',{
            method:'DELETE',
            headers: { 'Content-Type': 'application/json'},
            body: JSON.stringify({
                id: values.id
            })
        }).then(res => res.json()).then((response) => {
        if(response.status) {
            getList()
        }
    })
    }

  const getList = useCallback(async () => {
    fetch('http://localhost:3333/getPrograms')
      .then((res) => res.json())
      .then((response) => {
        setListaProgramas(response)
      })
  }, [])
  useEffect(() => {
    getList()
  }, [getList])

  const viewPrograma = (programa) => {
    setIsOpenModal(true)
    setDados(programa)
  }
  return (
    <>
        <Grid container spacing={2}>
            <Grid item xs={12} style={{display:'flex', justifyContent:'center', marginTop:'10px'}}>
                <Button variant='contained' color='primary' onClick={() => setIsOpenModal(true)}>Adicionar Programa</Button>
            </Grid>
            <Grid container style={{justifyContent:'center'}}>
                {listaProgramas.map(programa => 
                    <Grid item xs={6} md={3} lg={2} style={{border:'1px solid black', margin:'10px', cursor:'pointer', borderRadius:'6px'}} onClick={() => viewPrograma(programa)} key={programa.id}>
                        <Box width={'100%'} height={'45%'} padding={'20px'}>
                                <Typography>{programa.title}</Typography>
                                <Button fullWidth variant='contained' color='error' onClick={(e) => excluiPrograma(e,programa)}>Excluir</Button>
                        </Box>
                    </Grid>
                    )}
                    </Grid>
            </Grid>
            <Dialog onClose={() => {
                setIsOpenModal(false)
                setDados([])
            }} open={isOpenModal} maxWidth={'md'} fullWidth>
                <DialogTitle>
                    Cadastro de Programas
                </DialogTitle>
                <DialogContent>
                    <Formik
                        validationSchema={FormSchema}
                        initialValues={initialValues}
                        onSubmit={(values, {setSubmitting, resetForm}) => {
                            setSubmitting(false)
                            salvarPrograms(values, resetForm)
                        }}
                            >
                            {({submitForm, isSubmitting}) => (
                                <>
                                    <Grid item xs={12} md={3} lg={3}>
                                        <Field component={TextField} fullWidth label='Title' name='title' variant='outlined' margin='dense' />
                                    </Grid>
                                    <Grid item xs={12} md={3} lg={3}>
                                        <Field component={TextField} fullWidth label='Description' name='description' variant='outlined' margin='dense' />
                                    </Grid>
                                    <Grid item xs={12} md={3} lg={3}>
                                        <Field component={TextField} fullWidth label='Repository Url' name='urlRepo' variant='outlined' margin='dense' />
                                    </Grid>
                                    <Grid item xs={12} md={3} lg={3}>
                                        <Field component={TextField} fullWidth label='Screen Url ' name='urlScreen' variant='outlined' margin='dense' />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Field component={TextField} type={'file'} variant='outlined' margin='dense' name='img'/>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Button disabled={!!isSubmitting}  fullWidth variant='contained' color='primary' onClick={submitForm} >Salvar</Button>
                                    </Grid>
                                </>
                            )}
                    </Formik>
                </DialogContent>
            </Dialog>
        </>
  )
}

export default App
