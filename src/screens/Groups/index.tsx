import { useState, useCallback } from "react";
import { Alert, FlatList } from "react-native";

import { Header } from "@components/Header";
import { Container } from "./styles";
import { HightLight } from "@components/Hightlight";
import { GroupCard } from "@components/GroupCard";
import { ListEmpty } from "@components/ListEmpty";
import { Button } from "@components/Button";

import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { groupGetAll } from "@storage/group/groupsGetAll";
import { Loading } from "@components/Loading";

export function Groups() {
  const [isLoading, setIsLoading] = useState(true);
  const [groups, setGroups] = useState<string[]>([]);

  const navigation = useNavigation();

  function handleNewGroup() {
    navigation.navigate("new");
  }

  async function fetchGroups() {
    try {
      setIsLoading(true);
      const data = await groupGetAll();
      setGroups(data);
    } catch (error) {
      console.log(error);
      Alert.alert("Turmas", "Não foi possível carregar as turmas.");
    } finally {
      setIsLoading(false);
    }
  }

  function handleOpneGroup(group: string) {
    navigation.navigate("players", { group });
  }

  useFocusEffect(
    useCallback(() => {
      fetchGroups();
    }, [])
  );

  return (
    <>
      <Container>
        <Header />
        <HightLight title="Turmas" subtitle="Jogue com a sua turma" />

        {isLoading ? (
          <Loading />
        ) : (
          <FlatList
            data={groups}
            keyExtractor={(item) => item}
            renderItem={({ item }) => (
              <GroupCard title={item} onPress={() => handleOpneGroup(item)} />
            )}
            contentContainerStyle={groups.length === 0 && { flex: 1 }}
            ListEmptyComponent={() => (
              <ListEmpty message="Que tal cadastrar a primeira turma?" />
            )}
            showsVerticalScrollIndicator={false}
          />
        )}
        <Button title="Criar nova turma" onPress={handleNewGroup} />
      </Container>
    </>
  );
}
