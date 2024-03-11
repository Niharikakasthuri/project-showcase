import {Component} from 'react'
import Loader from 'react-loader-spinner'
const categoriesList = [
  {id: 'ALL', displayText: 'All'},
  {id: 'STATIC', displayText: 'Static'},
  {id: 'RESPONSIVE', displayText: 'Responsive'},
  {id: 'DYNAMIC', displayText: 'Dynamic'},
  {id: 'REACT', displayText: 'React'},
]
const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}
class Project extends Component {
  state = {
    actId: categoriesList[0].id,
    dataList: [],
    apiStatus: apiStatusConstants.initial,
  }
  componentDidMount() {
    this.getData()
  }
  getData = async () => {
    this.setState({apiStatus: apiStatusConstants.inProgress})
    const {actId} = this.state
    const url = `https://apis.ccbp.in/ps/projects?category=${actId}`
    const response = await fetch(url)
    if (response.ok === true) {
      const data = await response.json()
      const updateData = data.projects.map(eachItem => ({
        id: eachItem.id,
        name: eachItem.name,
        imageUrl: eachItem.image_url,
      }))
      this.setState({
        dataList: updateData,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }
  changeSelector = event => {
    this.setState({actId: event.target.value}, this.getData)
  }
  renderSuccessView = () => {
    const {dataList} = this.state
    return (
      <ul>
        {dataList.map(each => (
          <li key={each.id}>
            <img src={each.imageUrl} alt={each.name} />
            <p>{each.name}</p>
          </li>
        ))}
      </ul>
    )
  }
  renderLoader = () => (
    <div data-testid="loader">
      <Loader type="ThreeDots" color="#334155" height={80} width={80} />
    </div>
  )
  renderFailure = () => (
    <div>
      <img
        src="https://assets.ccbp.in/frontend/react-js/projects-showcase/failure-img.png"
        alt="failure view"
      />
      <h1>Oops! Something Went Wrong</h1>
      <p>We cannot seem to find the page you are looking for</p>
      <button onClick={this.getData()}>Retry</button>
    </div>
  )
  renderAllView = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderSuccessView()
      case apiStatusConstants.failure:
        return this.renderFailure()
      case apiStatusConstants.inProgress:
        return this.renderLoader()
      default:
        return null
    }
  }
  render() {
    const {actId} = this.state
    return (
      <div>
        <nav>
          <img
            src="https://assets.ccbp.in/frontend/react-js/projects-showcase/website-logo-img.png"
            alt="website logo"
          />
        </nav>
        <div>
          <select onChange={this.changeSelector} value={actId}>
            {categoriesList.map(each => (
              <option value={each.id} key={each.id}>
                {each.displayText}
              </option>
            ))}
          </select>
          {this.renderAllView()}
        </div>
      </div>
    )
  }
}

export default Project
