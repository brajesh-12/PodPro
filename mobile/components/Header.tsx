import { View, Text } from 'react-native';
import { Cast, Bell, Search, ChevronDown } from 'lucide-react-native';
import React from 'react';

interface Screen {
  screen: string
}

const Header: React.FC<Screen> = ({ screen }) => {
  return (
    // this is main container
    <View
      style={{
        height: 48,
        flexDirection: 'row',
        paddingLeft: 20,
        paddingRight: 12,
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 8
      }}
    >
      {/* Left container */}

      {
        screen === 'home' ?
          (
            <View
              style={{
                flexDirection: 'row',
                gap: 8,
                alignItems: 'center'
              }}
            >
              <View
                style={{
                  height: 32,
                  width: 32,
                  backgroundColor: "grey",
                  borderRadius: 64
                }}
              ></View>
              <View
                style={{
                  flexDirection: 'column',
                }}
              >
                <Text
                  style={{
                    fontFamily: "SF Pro",
                    fontSize: 12,
                    lineHeight: 16,
                    color: 'grey'
                  }}
                >
                  Welcome Back!
                </Text>
                <Text
                  style={{
                    fontFamily: "SF Pro",
                    fontSize: 16,
                    fontWeight: "500",
                    lineHeight: 20,
                  }}
                >
                  Brajesh
                </Text>
              </View>
            </View>
          ) 
          : screen === 'library' ? (
            <View
              style={{
                flexDirection: 'row',
                gap: 4,
                alignItems: 'center'
              }}
            >
              <Text
                style={{
                  fontFamily: "SF Pro",
                  fontSize: 18,
                  fontWeight: 600,
                  lineHeight: 28
                }}
              >
                Library
              </Text>
              <ChevronDown  size={16} strokeWidth={2}/>
            </View>
          ) : (
            <View
              style={{
                flexDirection: 'row',
                gap: 4,
                alignItems: 'center'
              }}
            >
              <Text
                style={{
                  fontFamily: "SF Pro",
                  fontSize: 18,
                  fontWeight: 600,
                  lineHeight: 28
                }}
              >
                Podcasts
              </Text>
              <ChevronDown  size={16} strokeWidth={2}/>
            </View>
          )
      }


      {/* Right container/Icon container */}
      <View
        style={{
          flexDirection: 'row',
          gap: 2
        }}
      >
        <View
          style={{
            height: 36,
            width: 36,
            borderRadius: 72,
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          <Cast size={22} strokeWidth={2} />
        </View>

        <View
          style={{
            height: 36,
            width: 36,
            borderRadius: 72,
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          <Bell size={22} strokeWidth={2} />
        </View>

        <View
          style={{
            height: 36,
            width: 36,
            borderRadius: 72,
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          <Search size={22} strokeWidth={2} />
        </View>
      </View>
    </View>
  )
}

export default Header;