```tsx
              <TouchableOpacity onPress={() => {router.push("/predict")}}>
                <BentoBox size="small" className="border-lime-400 w-40 h-40 rounded-3xl mb-5" style={{ backgroundColor: "rgba(132, 204, 22, 0.3)", borderWidth: 1 }}>
                  <FontAwesome6 name="wand-magic-sparkles" size={30} color="white" />
                  <Text className="text-white mt-2 text-3xl" style={{ fontFamily:Fonts.Inter }}>Predict</Text>
                </BentoBox>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => {}}>
                <BentoBox size="small" className="border-blue-400 w-40 h-40 rounded-3xl mb-5" style={{ backgroundColor: "rgba(59, 130, 246, 0.3)", borderWidth: 1 }}>
                  <FontAwesome6 name="flag" size={30} color="white" />
                  <Text className="text-white mt-2 text-3xl" style={{ fontFamily:Fonts.Inter }}>Alliance</Text>
                </BentoBox>
              </TouchableOpacity>

            {Platform.OS != "web" && (
                <TouchableOpacity onPress={() => {}}>
                  <BentoBox size="small" className="border-green-400 w-40 h-40 rounded-3xl mb-5" style={{ backgroundColor: "rgba(34, 197, 94, 0.3)", borderWidth: 1 }}>
                    <AntDesign name="calendar" size={30} color="white" />
                    <Text className="text-white mt-2 text-3xl" style={{ fontFamily:Fonts.Inter }}>Agenda</Text>
                  </BentoBox>
                </TouchableOpacity>
              )}

            <TouchableOpacity onPress={() => {}}>
                <BentoBox size="small" className="border-stone-400 w-40 h-40 rounded-3xl mb-5" style={{ backgroundColor: "rgba(120, 113, 108, 0.3)", borderWidth: 1 }}>
                  <MaterialIcons name="tv" size={30} color="white" />
                  <Text className="text-white mt-2 text-3xl" style={{ fontFamily:Fonts.Inter }}>TV</Text>
                </BentoBox>   
              </TouchableOpacity>
```