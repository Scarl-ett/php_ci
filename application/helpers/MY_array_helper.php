<?php
    /**
     * Array ���� Helper Ȯ�� �մϴ�.
     * 
     * function test() {
     * } 
     * Helper�� Ŭ������ �������� �ʰ� ���� ���� �Լ��� ���� �մϴ�.
     * Core�� Helper�� ������ �� �� �ֽ��ϴ�.
     * 
     * @author junhan Lee <junes127@gmail.com>
     */

    /**
     *  2���� �迭
     *  ex) ������ Ű �̸��� 2���迭���� ã�Ƽ� �ش� Ű���� 1���迭�� Ű �̸����� ������ݴϴ�.
     */
    function array_key($aData, $sIdxName) {

        if (empty($aData)) return;

        $aResult = array();
        foreach($aData as $sKey => $aValue){
            $aResult[$aValue[$sIdxName]] = $aValue;
        }

        return $aResult;

    }
    
    /**
     *  2���� �迭
     *  ex) ������ Ű �̸��� 2���迭 ���� ã�Ƽ� �ش� Ű���� 1���� �迭�� ������ݴϴ�.
     */
    function array_value($aData, $sIdxName) {
        
        if (empty($aData)) return;
        
        $aResult = array();
        foreach($aData as $sKey => $aValue){
            $aResult[] = $aValue[$sIdxName];
        }

        return $aResult;

    }
    
    /**
     * �� ���� �迭���� �˷��ݴϴ�.
     */
    function array_deep($arr, $deep=0)
    {
        if (!is_array($arr)) {
            return $deep;
        }
    
        $deep ++;
        foreach ($arr as $key => $value) {
            $deeps[] = array_deep($arr[$key], $deep);
        }
    
        if (empty($deeps)) {
            return null;
        } else {
            return max($deeps);
        }
    }        
    
    function sortByArrayValue ($array, $key) {
        $sorter=array();
        $ret=array();
        reset($array);
        foreach ($array as $ii => $va) {
            $sorter[$ii]=$va[$key];
        }
        asort($sorter);
        foreach ($sorter as $ii => $va) {
            $ret[$ii]=$array[$ii];
        }
        
        return $ret;
    }    
