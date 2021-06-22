import React, { useEffect } from 'react';
import { useState } from 'react';
import { createContext } from "react";
import { useRealmApp } from "../RealmApp";
import * as Realm from "realm-web";

const idariContext = createContext();

export function ProvideIdari({ children }) {
    const idari = useProvideIdari();
    return (
      <idariContext.Provider value={idari}>
        {children}
      </idariContext.Provider>
    );
  }
  
  
  export function useProvideIdari() {
    const app = useRealmApp();
    //app?.currentUser?.mongoClient("mongodb-atlas");
  
    const listABD = async () => {
        const mongodb = app?.currentUser?.mongoClient("mongodb-atlas");
        let list =  await mongodb.db("tez").collection("ABD").find()
        return list;
    }
    const listEnstitu = async () => {
        const mongodb = app?.currentUser?.mongoClient("mongodb-atlas");
        let list =  await mongodb.db("tez").collection("Enstitu").find()
        return list;
    }
    const listBolum = async () => {
        const mongodb = app?.currentUser?.mongoClient("mongodb-atlas");
        let list =  await mongodb.db("tez").collection("Bolum").find()
        return list;
    }
    
    const listPersonel = async () => {
        const mongodb = app?.currentUser?.mongoClient("mongodb-atlas");
        let list =  await mongodb.db("tez").collection("UserData").find({type:"AKADEMIK"})
        return list;
    }

    const listOgrenci = async () => {
        const mongodb = app?.currentUser?.mongoClient("mongodb-atlas");
        let list =  await mongodb.db("tez").collection("UserData").find({type:"OGRENCI"})
        return list;
    }

    const insertABD = async (data) => {
        const mongodb = app?.currentUser?.mongoClient("mongodb-atlas");
        return await mongodb.db("tez").collection("ABD").insertOne(data)
    }
    const deleteABD = async (_id) => {
        const mongodb = app?.currentUser?.mongoClient("mongodb-atlas");
        return await mongodb.db("tez").collection("ABD").deleteOne({_id})
    }
    
    const insertBolum = async (data) => {
        const mongodb = app?.currentUser?.mongoClient("mongodb-atlas");
        return await mongodb.db("tez").collection("Bolum").insertOne(data)
    }
    
    const deleteBolum = async (_id) => {
        const mongodb = app?.currentUser?.mongoClient("mongodb-atlas");
        return await mongodb.db("tez").collection("Bolum").deleteOne({_id})
    }
    const insertEnstitu = async (data) => {
        const mongodb = app?.currentUser?.mongoClient("mongodb-atlas");
        return await mongodb.db("tez").collection("Enstitu").insertOne(data)
    }
    const deleteEnstitu= async (_id) => {
        const mongodb = app?.currentUser?.mongoClient("mongodb-atlas");
        return await mongodb.db("tez").collection("Enstitu").deleteOne({_id})
    }
    const createPersonel = async (data) => {
        const {email, password, ...rest} = data;
        const mongodb = app?.currentUser?.mongoClient("mongodb-atlas");
        const {insertedId, ...res} = await mongodb.db("tez").collection("User").insertOne({email, password});
        console.log(insertedId, res)
        let result = await mongodb.db("tez").collection("UserData").insertOne({_id:insertedId, user_id: "", email, ...rest});
        console.log(result)


        //return await mongodb.db("tez").collection("Enstitu").insertOne(data)
    } 

    const createOgrenci = async (data) => {
        const {email, password, ...rest} = data;
        const mongodb = app?.currentUser?.mongoClient("mongodb-atlas");
        const {insertedId, ...res} = await mongodb.db("tez").collection("User").insertOne({email, password});
        console.log(insertedId, res)
        let result = await mongodb.db("tez").collection("UserData").insertOne({_id:insertedId, user_id: "", email, ...rest});
        console.log(result)


        //return await mongodb.db("tez").collection("Enstitu").insertOne(data)
    } 
  
    const createTezOneri = async (data) => {
        const mongodb = app?.currentUser?.mongoClient("mongodb-atlas");
        return await mongodb.db("tez").collection("TezOneri").insertOne(data)
    }
    const listTezOneri = async (find) => {

        const mongodb = app?.currentUser?.mongoClient("mongodb-atlas");
        let list =  await mongodb.db("tez").collection("TezOneri").find(find || {})
        return list;
    }

    const createTez = async (data) => {
        const mongodb = app?.currentUser?.mongoClient("mongodb-atlas");
        return await mongodb.db("tez").collection("Tez").insertOne(data)
    }
    const listTez = async (find) => {

        const mongodb = app?.currentUser?.mongoClient("mongodb-atlas");
        let list =  await mongodb.db("tez").collection("Tez").find(find || {})
        return list;
    }
    const listUser = async (find) => {

        const mongodb = app?.currentUser?.mongoClient("mongodb-atlas");
        let list =  await mongodb.db("tez").collection("UserData").find(find || {})
        return list;
    }
    return {
        listABD,
        listBolum,
        listEnstitu,
        listPersonel,
        insertABD,
        insertBolum,
        insertEnstitu,
        createPersonel,
        listOgrenci,
        createOgrenci,
        listTezOneri,
        createTezOneri,
        listTez,
        createTez,
        listUser,
        deleteABD,
        deleteBolum,
        deleteEnstitu
    };
  }
  