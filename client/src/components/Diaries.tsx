import dateFormat from 'dateformat'
import { History } from 'history'
import * as React from 'react'

import {
  Button,
  Divider,
  Grid,
  Header,
  Icon,
  Image,
  Loader,
  Modal,
  Form,
  TextArea,
} from 'semantic-ui-react'

import { createDiary, deleteDiary, getDiaries, findDiariesByName, patchDiary } from '../api/diaries-api'
import Auth from '../auth/Auth'
import { Diary } from '../types/Diary'
interface DiariesProps {
  auth: Auth
  history: History
}

interface DiariesState {
  diaries: Diary[]
  newDiaryName: string
  loadingDiaries: boolean
  show: boolean,
  diaryUpdate: Diary,
  searchValue: string,
  file: any,
  update: boolean
}

export class Diaries extends React.PureComponent<DiariesProps, DiariesState> {
  emptyDiary: Diary = { diaryId: "", createdAt: "", title: "", content: "", urlImage: "" }
  state: DiariesState = {
    diaries: [],
    newDiaryName: '',
    loadingDiaries: true,
    show: false,
    diaryUpdate: this.emptyDiary,
    searchValue: '',
    file: undefined,
    update: false
  }

  // handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   this.setState({ newDiaryName: event.target.value })
  // }
  handleClose = () => { this.setState({ show: false }) };
  handleShow = () => { this.setState({ show: true }) };

  onDiaryCreate = async () => {
    try {
      const dueDate = this.calculateDueDate()
      const newDiary = await createDiary(this.props.auth.getIdToken(), {
        title: this.state.diaryUpdate.title,
        content: this.state.diaryUpdate.content,
      }, this.state.file[0]
      )
      this.componentDidMount()
    } catch {
      alert('Diary creation failed')
    }
  }
  onDiaryUpdate = async () => {
    console.log("id", this.state.diaryUpdate.diaryId)
    console.log("title", this.state.diaryUpdate.title)

    console.log("content", this.state.diaryUpdate.content)

    console.log("urlImage", this.state.diaryUpdate.urlImage)

    try {

      await patchDiary(this.props.auth.getIdToken(), this.state.diaryUpdate.diaryId, {
        title: this.state.diaryUpdate.title,
        content: this.state.diaryUpdate.content,
        urlImage: this.state.diaryUpdate.urlImage,
      }, this.state.file != null ? this.state.file[0] : null).then(()=>{
         this.componentDidMount()
      }
      )
    } catch {
      alert('Diary updated failed')
    }
  }



  onSearch = async () => {
    try {
      if (this.state.searchValue !== "") {
        const newDiary = await findDiariesByName(this.props.auth.getIdToken(), this.state.searchValue)
        if ((newDiary.length) !== 0) {
          console.log(newDiary)
          this.setState({
            diaries: newDiary,
            searchValue: ""
          })
        } else {
          this.setState({
            searchValue: ""
          })
          alert('Can not find diaries')
        }

      }
    } catch {
      alert('Can not find diaries')
    }
  }


  onDiaryDelete = async (diaryId: string) => {
    try {
      await deleteDiary(this.props.auth.getIdToken(), diaryId)
      this.setState({
        diaries: this.state.diaries.filter(todo => todo.diaryId !== diaryId)
      })
    } catch {
      alert('Diary deletion failed')
    }
  }

  async componentDidMount() {
    try {
      const diaries = await getDiaries(this.props.auth.getIdToken())
      this.setState({
        diaries,
        loadingDiaries: false
      })
    } catch (e) {
      alert(`Failed to fetch diary: ${(e as Error).message}`)
    }
  }

  render() {
    return (
      <div>
        <Header as="h1">DIARY</Header>
        {this.renderSearch()}
        {this.renderCreateDiaryInput()}
        {this.renderDiaries()}
        {this.renderModal()}
      </div>
    )
  }
  renderSearch() {
    return (
      <Form onSubmit={() => {
        this.onSearch()
        this.renderDiariesList()

      }}>
        <Form.Group>
          <input placeholder='Title' onChange={(e) => {
            this.state.searchValue = e.target.value
            this.setState({ searchValue: this.state.searchValue })
          }} />
          <Button color='green' type='submit'><Icon name="search" /></Button>
          <Button color='blue' onClick={() => {
            this.componentDidMount()
            this.renderDiariesList()
          }} ><Icon name="sync" />clear</Button>

        </Form.Group>
      </Form>
    )
  }

  renderCreateDiaryInput() {
    return (
      <Grid.Row>
        <Grid.Column width={16}>

          <Button
            icon
            color="blue"
            onClick={() => {
              this.handleShow()
            }}
          >
            <Icon name="add" />create new diary
          </Button>
        </Grid.Column>
        <Grid.Column width={16}>
          <Divider />
        </Grid.Column>
      </Grid.Row>
    )
  }

  renderDiaries() {
    if (this.state.loadingDiaries) {
      return this.renderLoading()
    }

    return this.renderDiariesList()
  }

  renderLoading() {
    return (
      <Grid.Row>
        <Loader indeterminate active inline="centered">
          Loading DIARIES
        </Loader>
      </Grid.Row>
    )
  }

  renderDiariesList() {
    return (
      <Grid padded>
        {this.state.diaries.map((todo, pos) => {
          return (
            <Grid.Row key={todo.diaryId}>
              <Grid.Column width={12} verticalAlign="top">
                <h1> {todo.title}</h1>
              </Grid.Column>
              <Grid.Column width={12} verticalAlign="middle">
                Created At: {todo.createdAt}
              </Grid.Column>
              <Grid.Column width={6} floated="left">
                <Button
                  icon
                  color="blue"
                  onClick={() => {
                    this.handleShow()
                    this.setState({ diaryUpdate: todo, update: true })
                  }}
                >
                  <Icon name="pencil" />update
                </Button>
                <Button
                  icon
                  color="red"
                  onClick={() => this.onDiaryDelete(todo.diaryId)}
                >
                  <Icon name="delete" />delete
                </Button>
              </Grid.Column>
              <Grid.Column width={12} verticalAlign="middle">
                {todo.urlImage && (
                  <Image src={todo.urlImage} size="big" wrapped type />
                )}
              </Grid.Column>
              <Grid.Column width={12} verticalAlign="middle">
                Content: {todo.content}
              </Grid.Column>
              <Grid.Column width={12}>
                <Divider />
              </Grid.Column>
            </Grid.Row>
          )
        })}
      </Grid>
    )
  }

  calculateDueDate(): string {
    const date = new Date()
    date.setDate(date.getDate() + 7)

    return dateFormat(date, 'yyyy-mm-dd') as string
  }



  renderModal() {
    return (
      <Modal
        onClose={() => this.handleClose()}
        onOpen={() => this.handleShow()}
        open={this.state.show}
      >
        <Modal.Header>{this.state.diaryUpdate.title !== "" ? "Update Diary" : "Create Diary"}</Modal.Header>
        <Modal.Content >
          <Form onSubmit={() => {
            if (this.state.update == true) {
              this.onDiaryUpdate()
              this.handleClose()
              this.setState({ diaryUpdate: this.emptyDiary, file: undefined, update: false })
            } else {
              this.onDiaryCreate()
              this.handleClose()
              this.setState({ diaryUpdate: this.emptyDiary, file: undefined, update: false })
            }

          }}>
            <Form.Field>
              <label>Title</label>
              <input placeholder='Title' defaultValue={this.state.diaryUpdate.title} onChange={(e) => {
                this.state.diaryUpdate.title = e.target.value
                this.setState({ diaryUpdate: this.state.diaryUpdate })
              }} />
            </Form.Field>
            <Form.Field>
              <label>Content</label>
              <TextArea placeholder='Content' defaultValue={this.state.diaryUpdate.content} onChange={(e) => {
                this.state.diaryUpdate.content = e.target.value
                this.setState({ diaryUpdate: this.state.diaryUpdate })
              }} />
            </Form.Field>
            <Form.Field>
              <label>Change Image</label>
              <input type="file" id="img" name="img" accept="image/*" onChange={(e) => {
                this.state.file = e.target.files
                this.setState({ file: this.state.file })
              }} />
            </Form.Field>
            <Button color='black' onClick={() => {
              this.handleClose()
              this.setState({ diaryUpdate: this.emptyDiary })
            }}>
              Close
            </Button>
            <Button color='green' type='submit'>Submit</Button>
          </Form>
        </Modal.Content>
      </Modal>
    )
  }
}




