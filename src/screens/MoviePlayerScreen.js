// MoviePlayerScreen.js
import React from 'react';
import { WebView } from 'react-native-webview';
import { View, TouchableOpacity, Text } from 'react-native';

export default function MoviePlayerScreen({ route, navigation }) {
  const { url, title } = route.params;

  // Script para bloquear ads (estilo Brave)
  const adBlockScript = 
    (function() {
      // Bloquear pop-ups
      window.open = function() { return null; };
      
      // Bloquear elementos de ads comunes
      const adSelectors = [
        'ins.adsbygoogle',
        'iframe[src*="doubleclick"]',
        'div[id*="ad-"]',
        'div[class*="advertisement"]'
      ];
      
      adSelectors.forEach(selector => {
        document.querySelectorAll(selector).forEach(el => {
          el.remove();
        });
      });
      
      // Bloquear redirects
      window.addEventListener('beforeunload', (e) => {
        e.preventDefault();
        return '';
      });
    })();
  ;

  return (
    <View style={{ flex: 1 }}>
      {/* Header con botón de cerrar */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.closeButton}>✕ Cerrar</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{title}</Text>
      </View>

      {/* WebView */}
      <WebView
        source={{ uri: url }}
        injectedJavaScript={adBlockScript}
        allowsInlineMediaPlayback
        mediaPlaybackRequiresUserAction={false}
        javaScriptEnabled
        domStorageEnabled
        onShouldStartLoadWithRequest={(request) => {
          // Bloquear dominios de ads conocidos
          const blockedDomains = [
            'doubleclick.net',
            'googleadservices.com',
            'googlesyndication.com'
          ];
          
          return !blockedDomains.some(domain => 
            request.url.includes(domain)
          );
        }}
      />
    </View>
  );
}