/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  // Text,
  StatusBar,
  Alert,
  Image, 
  TouchableOpacity, 
  NativeModules, 
  Dimensions,
  Fragment
} from 'react-native';

import {
  Header,
  LearnMoreLinks,
  Colors,
  DebugInstructions,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';

import Video from 'react-native-video';
// import ImagePicker from 'react-native-image-crop-picker';

import { mapping, light as lightTheme } from '@eva-design/eva';
import { ApplicationProvider, Layout, Text } from 'react-native-ui-kitten';

var ImagePicker = NativeModules.ImageCropPicker;

const ApplicationContent = () => (
  <Layout style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
    {/* <Text>Welcome to UI Kitten</Text> */}
  </Layout>
); 


// const App: () => React$Node = () => {
export default class App extends Component  {

  constructor() {
    super();
    this.state = {
      image: null,
      images: null
    };
  }

  pickSingleWithCamera(mediaType='photo') {
    ImagePicker.openCamera({
      // cropping: cropping,
      width: 500,
      height: 500,
      includeExif: true,
      mediaType,
    }).then(image => {
      console.log('received image', image);
      this.setState({
        image: {uri: image.path, width: image.width, height: image.height, mime: image.mime},
        images: null
      });
    }).catch(e => alert(e));
  }

  pickSingleBase64() {
    ImagePicker.openPicker({
      width: 300,
      height: 300,
      // cropping: cropit,
      includeBase64: true,
      // includeExif: true,
    }).then(image => {
      console.log('received base64 image');
      this.setState({
        image: {uri: `data:${image.mime};base64,`+ image.data, width: image.width, height: image.height},
        images: null
      });
    }).catch(e => alert(e));
  }

  cleanupImages() {
    ImagePicker.clean().then(() => {
      console.log('removed tmp images from tmp directory');
    }).catch(e => {
      alert(e);
    });
  }

  cleanupSingleImage() {
    let image = this.state.image || (this.state.images && this.state.images.length ? this.state.images[0] : null);
    console.log('will cleanup image', image);

    ImagePicker.cleanSingle(image ? image.uri : null).then(() => {
      console.log(`removed tmp image ${image.uri} from tmp directory`);
    }).catch(e => {
      alert(e);
    })
  }

  cropLast() {
    if (!this.state.image) {
      return Alert.alert('No image', 'Before open cropping only, please select image');
    }

    ImagePicker.openCropper({
      path: this.state.image.uri,
      width: 200,
      height: 200
    }).then(image => {
      console.log('received cropped image', image);
      this.setState({
        image: {uri: image.path, width: image.width, height: image.height, mime: image.mime},
        images: null
      });
    }).catch(e => {
      console.log(e);
      Alert.alert(e.message ? e.message : e);
    });
  }


  pickSingle() {
    ImagePicker.openPicker({
      width: 500,
      height: 500,
      // cropping: cropit,
      // cropperCircleOverlay: circular,
      compressImageMaxWidth: 1000,
      compressImageMaxHeight: 1000,
      compressImageQuality: 1,
      compressVideoPreset: 'MediumQuality',
      includeExif: true,
      mediaType:'video'
    }).then(video => {
      console.log('received video', video);
      this.setState({
        video: {uri: video.path, width: video.width, height: video.height, mime: video.mime},
        images: null
      });
    }).catch(e => {
      console.log(e);
      Alert.alert(e.message ? e.message : e);
    });
  }

  pickMultiple() {
    ImagePicker.openPicker({
      multiple: true,
      waitAnimationEnd: false,
      includeExif: true,
      forceJpg: true,
    }).then(images => {
      this.setState({
        image: null,
        images: images.map(i => {
          console.log('received image', i);
          return {uri: i.path, width: i.width, height: i.height, mime: i.mime};
        })
      });
    }).catch(e => alert(e));
  }

  scaledHeight(oldW, oldH, newW) {
    return (oldH / oldW) * newW;
  }

  renderVideo(video) {
    console.log('rendering video');
    return (
    
    <View style={{height: 300, width: 300}}>
      <Video source={{uri: video.uri, type: video.mime}}
         style={{position: 'absolute',
            top: 0,
            left: 0,
            bottom: 0,
            right: 0
          }}
         rate={1}
         paused={false}
         volume={1}
         muted={false}
         resizeMode={'cover'}
         onError={e => console.log(e)}
         onLoad={load => console.log(load)}
         repeat={true}></Video>
     </View>
    
     );
  }

  renderImage(image) {
    console.log('rendering photo');
    return <Image style={{width: 300, height: 300, resizeMode: 'contain'}} source={image} />
  }

  renderAsset(image) {
    if (image.mime && image.mime.toLowerCase().indexOf('video/') !== -1) {
      return this.renderVideo(image);
    }

    return this.renderImage(image);
  }

  sellectVideoFromFile() {
    ImagePicker.openPicker({
      mediaType: "video",
      
    }).then(image => {
      console.log(image);
      this.setState({
        image: {uri: image.uri, width: image.width, height: image.height, mime: image.mime},
        images: null
      });
      // console.log(this.renderAsset(this.state.image));
      console.log('picking video');
  });
}

  sellectPhotoFromFile() {
    ImagePicker.openPicker({
      multiple: true
    }).then(images => {
      console.log(images);
      // console.log(this.renderAsset(this.state.image));
    });
  }

  render() {
    return (
    <ApplicationProvider mapping={mapping} theme={lightTheme}>
        
      <View style={styles.container}>
        <ScrollView >
          {/* fb flow */}
          {this.state.image ? this.renderAsset(this.state.image) : null}
          {this.state.images ? this.state.images.map(i => <View key={i.uri}>{this.renderAsset(i)}</View>) : null}
        </ScrollView>

        <TouchableOpacity onPress={() => this.sellectVideoFromFile()} style={styles.button}>
          <Text style={styles.text}>Select Single Video From File</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => this.sellectPhotoFromFile()} style={styles.button}>
          <Text style={styles.text}>Select Multiple Photo From File</Text>
        </TouchableOpacity>

        
        <TouchableOpacity onPress={() => this.pickSingleWithCamera(mediaType='video')} style={styles.button}>
          <Text style={styles.text}>Select Single Video With Camera</Text>
        </TouchableOpacity>
        
        <TouchableOpacity onPress={() => this.pickSingle(false)} style={styles.button}>
          <Text style={styles.text}>Select Single</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => this.pickSingleBase64(false)} style={styles.button}>
          <Text style={styles.text}>Select Single Returning Base64</Text>
        </TouchableOpacity>
        
        
        <TouchableOpacity onPress={this.pickMultiple.bind(this)} style={styles.button}>
          <Text style={styles.text}>Select Multiple</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={this.cleanupImages.bind(this)} style={styles.button}>
          <Text style={styles.text}>Cleanup All Images</Text>
        </TouchableOpacity>
        
      </View>
      
    </ApplicationProvider>
    );
 }
};

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: Colors.lighter,
  },
  engine: {
    position: 'absolute',
    right: 0,
  },
  body: {
    backgroundColor: Colors.white,
  },
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: Colors.black,
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
    color: Colors.dark,
  },
  highlight: {
    fontWeight: '700',
  },
  footer: {
    color: Colors.dark,
    fontSize: 12,
    fontWeight: '600',
    padding: 4,
    paddingRight: 12,
    textAlign: 'right',
  },


  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  button: {
    backgroundColor: 'blue',
    marginBottom: 10
  },
  text: {
    color: 'white',
    fontSize: 20,
    textAlign: 'center'
  }

});

// export default App;
