import * as React from 'react'
import { Link } from 'react-router-dom'
import MediaQuery from 'react-responsive'

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { toggleSidebar, showSearchPane } from '../../redux/actions/homeActions'

import { LANG, SERVERS, SETTINGS } from '../../common'
import { NavBar, Icon, SplitView, SplitParent, SplitChild, Avatar, ListItem, TextField } from '../modules'
import App from '../components/app'

interface IProps {
  toggleSidebar: Function
  showSearchPane: Function
}

interface IState {
}

class Account extends React.Component<IProps, IState> {
  constructor(props: any) {
    super(props)
  }

  componentWillMount() {
    console.log('this is self')
    console.log(SERVERS)
  }

  render() {
    return (
      <App>
        <SplitView>
          <SplitParent>
            <NavBar 
              title={LANG.t('sidebar.Account')}
              prev={{glyph: {name: 'menu'}, title: LANG.t('base:navigation.Menu'), onPress: this.props.toggleSidebar}}
            />
            <div className="singular-page-content">
              <div className="singular-account-banner">
                <div className="singular-account-banner-avatar">
                  <div>
                    <Avatar
                      url=""
                      size="xxl"
                    />
                    <div>this is the name</div>
                  </div>
                </div>
                <div className="singular-account-banner-stats">
                  <div>stat1</div>
                  <div>stat2</div>
                  <div>stat3</div>
                  <div>stat4</div>
                </div>
              </div>
              <ul className="singular-list">
                <ListItem
                  glyph={{name: 'menu'}}
                  title={LANG.t('user.account.PersonalInformation')}
                  isNew={true}
                  to='/account/personal'
                  showChevron={true}
                />
                <ListItem
                  glyph={{name: 'menu'}}
                  title={LANG.t('user.account.PersonalInformation')}
                  to='/account/personal'
                  showChevron={true}
                />
                <ListItem
                  glyph={{name: 'menu'}}
                  title={LANG.t('user.account.PersonalInformation')}
                  to='/account/personal'
                  showChevron={true}
                />
                <ListItem
                  glyph={{name: 'menu'}}
                  title={LANG.t('user.account.PersonalInformation')}
                  to='/account/personal'
                  badge={{value: 9}}
                  showChevron={true}
                />
              </ul>
              <ul className="singular-list">
                <ListItem
                  glyph={{name: 'menu'}}
                  title={LANG.t('user.account.PersonalInformation')}
                  isNew={true}
                  to='/account/personal'
                  showChevron={true}
                />
                <ListItem
                  glyph={{name: 'menu'}}
                  title={LANG.t('user.account.PersonalInformation')}
                  to='/account/personal'
                  showChevron={true}
                />
                <ListItem
                  glyph={{name: 'menu'}}
                  title={LANG.t('user.account.PersonalInformation')}
                  to='/account/personal'
                  showChevron={true}
                />
                <ListItem
                  glyph={{name: 'menu'}}
                  title={LANG.t('user.account.PersonalInformation')}
                  to='/account/personal'
                  badge={{value: 9}}
                  showChevron={true}
                />
              </ul>
              <ul className="singular-list">
                <ListItem
                  glyph={{name: 'menu'}}
                  title={LANG.t('user.account.PersonalInformation')}
                  isNew={true}
                  to='/account/personal'
                  showChevron={true}
                />
                <ListItem
                  glyph={{name: 'menu'}}
                  title={LANG.t('user.account.PersonalInformation')}
                  to='/account/personal'
                  showChevron={true}
                />
                <ListItem
                  glyph={{name: 'menu'}}
                  title={LANG.t('user.account.PersonalInformation')}
                  to='/account/personal'
                  showChevron={true}
                />
                <ListItem
                  glyph={{name: 'menu'}}
                  title={LANG.t('user.account.PersonalInformation')}
                  to='/account/personal'
                  badge={{value: 9}}
                  showChevron={true}
                />
              </ul>
            </div>
          </SplitParent>
          <SplitChild>
            <NavBar 
              title={LANG.t('user.account.PersonalInformation')}
              prev={{glyph: {name: 'back'}, title: LANG.t('base:navigation.Back'), onPress: () => history.back()}}
            >
              <Icon glyph={{name: 'edit'}} title="" />
            </NavBar>
            <SplitView>
              <SplitParent>
              </SplitParent>
              <SplitChild>
              <div className="singular-page-content">
              <form>
                <fieldset>
                  <input type="file" />
                  <TextField
                    type="text"
                    name="username"
                    required={true}
                    placeholder={LANG.t('user.login.username')}
                    tabIndex={1}
                    label={LANG.t('user.login.username')}
                    readonly={true}
                  />
                  <TextField
                    type="text"
                    name="handle"
                    required={false}
                    placeholder={LANG.t('user.account.Handle')}
                    tabIndex={2}
                    label={LANG.t('user.account.Handle')}
                  />
                  <TextField
                    type="tel"
                    name="mobile"
                    required={false}
                    placeholder={LANG.t('user.account.MobilePhoneNumber')}
                    tabIndex={2}
                    label={LANG.t('user.account.MobilePhoneNumber')}
                  />
                  
                </fieldset>
              </form>
            </div>
              </SplitChild>
            </SplitView>
          </SplitChild>
        </SplitView>
      </App>
    )
  }
}

const mapStateToProps = (state: any, ownProps: any) => {
  return {
    home: state.home,
    logs: state.logs
  }
}

const mapDispatchToProps = (dispatch: any, ownProps: any) => {
  return {
    toggleSidebar: bindActionCreators(toggleSidebar, dispatch),
    showSearchPane: bindActionCreators(showSearchPane, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Account)
