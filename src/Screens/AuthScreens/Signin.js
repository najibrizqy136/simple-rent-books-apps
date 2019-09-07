import React, { Component } from 'react';
import { StyleSheet, View, Text } from "react-native";
import { Container, Content, Form, Item, Input, Label, Button, Toast } from 'native-base';
import { Col, Row } from 'react-native-easy-grid';
import AsyncStorage from '@react-native-community/async-storage';
import { connect } from 'react-redux';

import { login } from '../../Publics/Actions/user';

class Signin extends Component {
  constructor(props){
    super(props)
    this.state = {
      formData: {
        email: '',
        password: ''
      },
      showToast: false,
    }
  }

  handleChange = (name, value) => {
    let newFormData = {...this.state.formData}
    newFormData[name] = value
    this.setState({
      formData: newFormData
    })
    console.log(newFormData)
  }

  handleSubmit = () => {
    this.props.dispatch(login(this.state.formData))
    .then(async (res) => {
      if(res.action.payload.data.token !== undefined) {
        await AsyncStorage.setItem(
          'token', 
          res.action.payload.data.token,
          err => console.log(err)
        )
        this.props.navigation.navigate('HomeScreen')
      }
    })
    .catch(()=>{
      console.log(this.props.user.errMsg)
      Toast.show({
        text: this.props.user.errMsg,
        buttonText: "Okay",
        type: "danger",
        position:'top',
        duration:4000,
      })
    })
  }

  componentDidMount = async () => {
    await AsyncStorage.getItem(
      'token', 
      (err, res)=>{
        console.log(err,res);
        if(res)
          this.props.navigation.navigate('HomeScreen')
      }
    )
  }

  render() {
    return (
      <Container style={styles.container}>
        <Content showsVerticalScrollIndicator={false}>
            <View>
                <Text style={styles.title}>Here To Get{"\n"}Welcomed !</Text>
            </View>
            <Form style={styles.formSignin}>
                <Item floatingLabel>
                    <Label>Email</Label>
                    <Input keyboardType='email-address' autoCompleteType='email' onChangeText={(text)=>this.handleChange('email',text)} />
                </Item>
                <Item floatingLabel>
                    <Label>Password</Label>
                    <Input secureTextEntry={true} onChangeText={(text)=>this.handleChange('password',text)} />
                </Item>
                <Button onPress={this.handleSubmit} full dark rounded style={styles.btnSignin}>
                  <Text style={styles.textSignin}>Sign In</Text>
                </Button>
            </Form>
            <Row style={styles.foot}>
              <Col>
                <Text style={styles.btnSignup} onPress={() => {this.props.navigation.navigate('SignupScreen')}}>Sign Up</Text>  
              </Col>
              <Col>
                <Text style={styles.btnForgot}>Forgot Password</Text>
              </Col>
            </Row>
        </Content>
      </Container>
    );
  }
}

const mapStateToProps = state =>{
  return {
    user : state.user
  }
}

export default connect (mapStateToProps) (Signin)

let btnSignup = {
  textDecorationLine: 'underline',
  color: '#4B4C72',
}

const styles = StyleSheet.create({
    container: {
      marginLeft: 20,
      marginRight: 35,
    },
    title: {
      top: 90,
      marginLeft : 15,
      fontSize: 24,
      color: '#4B4C72',
      fontWeight: 'bold',
    },
    formSignin: {
      marginTop: 100,
    },
    btnSignin: {
      marginTop: 50,
      marginLeft: 15,
    },
    textSignin: {
      color:"white",
    },
    foot:{
      marginTop: 100,
      marginBottom: 50,
      marginLeft : 15,
    },
    btnSignup: {
      ...btnSignup,
    },
    btnForgot: {
      ...btnSignup,
      textAlign: 'right'
    }
});
