import { useState } from "react";
import { Button, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ImcScreen() {
    const [peso, setPeso] = useState(0)
    const [altura, setAltura] = useState(0)
    const [imc, setImc] = useState(0);

    function verificar(){
        if(!peso||!altura){
            alert("formulário inválido!")
            return
        }
        calcularImc();
    }
    function calcularImc(){
        const imc = peso / altura
        setImc(imc);
        setAltura(0);
        setPeso(0);
    }

    return(
        <View style={{
            flex:1,
            backgroundColor: "white"
        }}>
            <SafeAreaView style={{
                flex:1,
                justifyContent:"center",
                alignItems:"center",
                padding:20
            }}>
              {
                !imc ?
                <>
                  <TextInput
                placeholder="Peso"
                keyboardType="numeric"
                onChangeText={(e)=>{setPeso(Number(e))}}
                style={{
                    width:"80%",
                    borderWidth:1,
                    borderColor:"#bbb",
                    padding:10,
                    borderRadius:10,
                    marginBottom:15
                }}
                />

                <TextInput
                placeholder="Altura"
                keyboardType="numeric"
                onChangeText={(e)=>{setAltura(Number(e))}}
                style={{
                    width:"80%",
                    borderWidth:1,
                    borderColor:"#bbb",
                    padding:10,
                    borderRadius:10,
                    marginBottom:15
                }}
                />

                </>:
                <>
                <Text style={{marginBottom:10}}>Seu IMC é: {imc}</Text>   
                </>
              }
                <Button 
                title={
                    imc
                    ?"Calcular novamente"
                    :"Calcular"
                }
                onPress={()=>{
                    imc
                    ?setImc(0)
                    :verificar()
                    }}/>
            </SafeAreaView>
        </View>
    );

}