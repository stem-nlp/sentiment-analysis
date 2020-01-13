# -*- coding: utf-8 -*-


import json
import numpy as np
import pandas as pd
import tensorflow as tf
import jieba
from collections import defaultdict
from model import Model
from dataset import _tokenize,DataItem
from utils import *
from thrid_utils import read_vocab


def output_newquery(inputs):
    inputs = str(inputs)
    # vocab_file='scripts/data/vocab.txt'
    # label_file='scripts/data/labels.txt'
    # checkpoint_dir='scripts/data/elmo_ema_0120'
    # out_file='scripts/data/new_query.json'

    # vocab_file = '/home/kg/PycharmProjects/nlp_p2/nlp_2/static/modelData/vocab.txt'
    # label_file = '/home/kg/PycharmProjects/nlp_p2/nlp_2/static/modelData/labels.txt'
    # checkpoint_dir = '/home/kg/PycharmProjects/nlp_p2/nlp_2/static/modelData/elmo_ema_0120'
    # out_file = '/home/kg/PycharmProjects/nlp_p2/nlp_2/static/modelData/new_query.json'

    vocab_file = 'static/modelData/vocab.txt'
    label_file = 'static/modelData/labels.txt'
    checkpoint_dir = 'static/modelData/elmo_ema_0120'
    out_file = 'static/modelData/new_query.json'


    feature_list=["location_traffic_convenience", "location_distance_from_business_district", "location_easy_to_find", "service_wait_time",
                  "service_waiters_attitude", "service_parking_convenience", "service_serving_speed", "price_level", "price_cost_effective",
                  "price_discount", "environment_decoration", "environment_noise", "environment_space", "environment_cleaness", "dish_portion",
                  "dish_taste", "dish_look", "dish_recommendation", "others_overall_experience", "others_willing_to_consume_again"]
    new_dict=defaultdict()
    vocab, w2i = read_vocab(vocab_file)
    label_names, l2i = read_vocab(label_file)
    i2l = {v:k for k,v in l2i.items()}
    tag_l2i = {"1":0,"0":1,"-1":2,"-2":3}
    tag_i2l = {v:k for k,v in tag_l2i.items()}

    model_item=search_process(inputs,new_dict,feature_list,out_file,w2i)
    if isinstance(model_item,list):
        hparams = load_hparams(checkpoint_dir,{"mode":'inference','checkpoint_dir':checkpoint_dir+"/best_eval",'embed_file':None})
        with tf.Session(config = get_config_proto(log_device_placement=False)) as sess:
            model = Model(hparams)
            model.build()
            try:
                model.restore_model(sess)  #restore best solution
            except Exception as e:
                print("unable to restore model with exception",e)
                exit(1)
            (source, lengths, _, ids) = process_item(model_item)
            predict,logits = model.inference_clf_one_batch(sess, source, lengths)
            for i,(p,l) in enumerate(zip(predict,logits)):
                new_dict['id']='new_query'
                new_dict['content']=inputs
                for j in range(20):
                    label_name = i2l[j]
                    tag = tag_i2l[np.argmax(p[j])]
                    new_dict[label_name]=tag
            with open(out_file,'w') as f:
                f.write(json.dumps(new_dict,ensure_ascii=False)+'\n')
    return new_dict


def search_process(inputs,new_dict,feature_list,out_file,w2i):
    if len(inputs)==0:
        # df_saved=pd.read_json('/home/kg/PycharmProjects/nlp_p2/nlp_2/static/modelData/out.testa.json',encoding='utf-8',lines=True)
        df_saved = pd.read_json('static/modelData/out.testa.json',encoding='utf-8', lines=True)
        rand_id=np.random.randint(0,len(df_saved.id))
        rand_comment=df_saved.loc[df_saved.id==rand_id]['content']
        rand_comment=''.join(rand_comment.values[0].split(' '))
        new_dict['id']=str(rand_id)
        new_dict['content']=rand_comment
        for feat in feature_list:
            new_dict[feat]=str(df_saved.loc[rand_id,feat])
        with open(out_file,'w') as f:
            f.write(json.dumps(new_dict,ensure_ascii=False)+'\n')
        print('Done with randomly chosen comment')
        return 'Done'
        exit(0)
    else:
        if isinstance(inputs,str):
            cut_inputs=' '.join(jieba.cut(inputs))
            content=_tokenize(cut_inputs,w2i)
            model_item=[DataItem(content=content,labels=np.asarray(feature_list),length=len(content),id='new_query')]
            return model_item
        else:
            print('Input Error-Please provide a string')
            return 'Error'
            exit(1)

def process_item(list_items):
    contents = [item.content for item in list_items]
    contents=np.asarray(contents)
    lengths = [item.length for item in list_items]
    lengths = np.asarray(lengths)
    targets = np.asarray(item.labels for item in list_items)
    ids = [item.id for item in list_items]
    return contents, lengths, targets, ids

# if __name__ == '__main__':
#     inputs=input('Please provide your comments:')
#     inputs=str(inputs)
#     output_newquery(inputs)

